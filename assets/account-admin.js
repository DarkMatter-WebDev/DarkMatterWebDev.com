import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { isSuperAdminUser, resolveProfilePortalRole } from "./portal-auth.js";

const config = window.DM_SUPABASE_CONFIG || {};
const isSpanish = document.documentElement.lang.startsWith("es");
const accountPath = isSpanish ? "/es/account.html" : "/account.html";

const els = {
  gate: document.querySelector("[data-admin-gate]"),
  content: document.querySelector("[data-admin-content]"),
  loginLink: document.querySelector("[data-admin-login-link]"),
  email: document.querySelector("[data-admin-email]"),
  status: document.querySelector("[data-admin-session-status]"),
  signOut: document.querySelector("[data-admin-signout]"),
  tabNav: document.querySelector(".client-admin-tabs-nav"),
  tabs: Array.from(document.querySelectorAll("[data-admin-tab]")),
  tabPanels: Array.from(document.querySelectorAll("[data-admin-tab-panel]")),
  openTabButtons: Array.from(document.querySelectorAll("[data-admin-open-tab]")),
  messagesStatus: document.querySelector("[data-admin-messages-status]"),
  messagesTable: document.querySelector("[data-admin-messages-table]"),
  messagesCount: document.querySelector("[data-admin-messages-count]"),
  subscribersStatus: document.querySelector("[data-admin-subscribers-status]"),
  subscribersTable: document.querySelector("[data-admin-subscribers-table]"),
  subscribersCount: document.querySelector("[data-admin-subscribers-count]"),
  copySubscribers: document.querySelector("[data-admin-copy-subscribers]"),
  accountHoldersPanel: document.querySelector("[data-admin-account-holders-panel]"),
  accountHoldersStatus: document.querySelector("[data-admin-account-holders-status]"),
  accountHoldersTable: document.querySelector("[data-admin-account-holders-table]"),
  accountHoldersCount: document.querySelector("[data-admin-account-holders-count]"),
  deleteModal: document.querySelector("[data-admin-delete-modal]"),
  deleteTitle: document.querySelector("[data-admin-delete-title]"),
  deleteBody: document.querySelector("[data-admin-delete-body]"),
  deleteError: document.querySelector("[data-admin-delete-error]"),
  deleteConfirm: document.querySelector("[data-admin-delete-confirm]"),
  deleteCancel: document.querySelector("[data-admin-delete-cancel]"),
  deleteClose: document.querySelector("[data-admin-delete-close]"),
  exportModal: document.querySelector("[data-admin-export-modal]"),
  exportClose: document.querySelector("[data-admin-export-close]"),
  exportCancel: document.querySelector("[data-admin-export-cancel]"),
  exportCopy: document.querySelector("[data-admin-export-copy]"),
  exportPreview: document.querySelector("[data-admin-export-preview]"),
  exportCount: document.querySelector("[data-admin-export-count]"),
  exportStatus: document.querySelector("[data-admin-export-status]"),
  exportFormats: Array.from(document.querySelectorAll("[data-admin-export-format]"))
};

const nextPath = `${location.pathname}${location.search}${location.hash}`;
const loginUrl = new URL(accountPath, location.origin);
loginUrl.searchParams.set("next", nextPath);
if (els.loginLink) els.loginLink.href = loginUrl.href;

const t = {
  setupPending: "Add Supabase settings in assets/supabase-config.js to enable Admin Center.",
  loginRequired: "Owner login required",
  notAuthorized: "This account does not have owner access.",
  signedIn: "Owner session active",
  loadingMessages: "Loading portal messages...",
  noMessages: "No portal messages were returned.",
  messagesSetup: "Install the list_portal_messages() Supabase RPC to view account requests here.",
  deletingMessage: "Deleting portal message...",
  deleteMessageSetup: "Install the delete_portal_message() Supabase RPC before deleting messages.",
  loadingSubscribers: "Loading newsletter subscribers...",
  noSubscribers: "No newsletter subscribers were returned.",
  homepagePending: "Homepage newsletter sign-up source is not connected yet.",
  accountSignupPending: "Run the updated portal role setup SQL so future account signups are mirrored into the newsletter subscriber source.",
  loadingAccountHolders: "Loading account holders from Supabase...",
  noAccountHolders: "No account holders were returned from Supabase.",
  accountHoldersSetup: "Install the list_portal_account_holders() Supabase RPC to view auth account emails here.",
  deletingSubscriber: "Deleting newsletter subscriber...",
  deletingAccountHolder: "Deleting account holder...",
  deleteSubscriberSetup: "Install the delete_newsletter_subscriber() Supabase RPC before deleting subscriber rows.",
  deleteAccountSetup: "Install the delete_portal_account_holder() Supabase RPC before deleting account rows."
};

let tabControlsBound = false;
let deleteControlsBound = false;
let exportControlsBound = false;
let adminSupabase = null;
let currentAdminUserId = "";
let pendingDeleteAction = null;
let currentSubscriberRows = [];
let messagesLoaded = false;
let subscribersLoaded = false;
let accountHoldersLoaded = false;

function normalizeTabName(tabName) {
  const fallback = "overview";
  if (!tabName) return fallback;
  const normalized = String(tabName).replace(/^#/, "").trim().toLowerCase();
  return els.tabs.some((tab) => tab.dataset.adminTab === normalized) ? normalized : fallback;
}

function setActiveTab(tabName, updateHash = true) {
  const activeTab = normalizeTabName(tabName);
  els.tabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  els.tabPanels.forEach((panel) => {
    const isActive = panel.dataset.adminTabPanel === activeTab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
  if (updateHash && window.history?.replaceState) {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = activeTab === "overview" ? "" : activeTab;
    window.history.replaceState(null, "", nextUrl);
  }
  void handleTabActivated(activeTab);
}

async function handleTabActivated(activeTab) {
  if (!adminSupabase) return;
  if (activeTab === "messages" && !messagesLoaded) {
    messagesLoaded = true;
    await loadMessages(adminSupabase);
  }
  if (activeTab === "subscribers" && !subscribersLoaded) {
    subscribersLoaded = true;
    await loadSubscribers(adminSupabase);
  }
  if (activeTab === "accounts" && !accountHoldersLoaded) {
    accountHoldersLoaded = true;
    await loadAccountHolders(adminSupabase);
  }
}

function moveTabFocus(currentTab, direction) {
  const currentIndex = els.tabs.indexOf(currentTab);
  if (currentIndex === -1) return;
  const nextIndex = (currentIndex + direction + els.tabs.length) % els.tabs.length;
  const nextTab = els.tabs[nextIndex];
  nextTab?.focus();
  setActiveTab(nextTab?.dataset.adminTab);
}

function bindTabControls() {
  if (tabControlsBound) return;
  tabControlsBound = true;

  els.tabNav?.addEventListener("click", (event) => {
    const tab = event.target?.closest?.("[data-admin-tab]");
    if (!tab || !els.tabNav.contains(tab)) return;
    setActiveTab(tab.dataset.adminTab);
  });

  els.tabs.forEach((tab) => {
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        moveTabFocus(tab, 1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        moveTabFocus(tab, -1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        els.tabs[0]?.focus();
        setActiveTab(els.tabs[0]?.dataset.adminTab);
      }
      if (event.key === "End") {
        event.preventDefault();
        const lastTab = els.tabs[els.tabs.length - 1];
        lastTab?.focus();
        setActiveTab(lastTab?.dataset.adminTab);
      }
    });
  });

  els.openTabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.adminOpenTab));
  });
}

function bindDeleteControls() {
  if (deleteControlsBound) return;
  deleteControlsBound = true;

  els.subscribersTable?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-admin-delete-subscriber]");
    if (!button || !els.subscribersTable.contains(button) || button.disabled) return;
    const email = button.dataset.adminDeleteSubscriber || "";
    const label = button.dataset.adminDeleteLabel || email;
    openDeleteModal({
      title: "Delete subscriber?",
      body: `This will remove ${label} from the newsletter subscribers table. Their portal account will not be deleted.`,
      action: () => deleteNewsletterSubscriber(email)
    });
  });

  els.messagesTable?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-admin-delete-message]");
    if (!button || !els.messagesTable.contains(button) || button.disabled) return;
    const messageId = button.dataset.adminDeleteMessage || "";
    const label = button.dataset.adminDeleteLabel || "this message";
    openDeleteModal({
      title: "Delete message?",
      body: `This will permanently delete ${label} from the admin message center. This cannot be undone.`,
      action: () => deletePortalMessage(messageId)
    });
  });

  els.accountHoldersTable?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-admin-delete-account]");
    if (!button || !els.accountHoldersTable.contains(button) || button.disabled) return;
    const userId = button.dataset.adminDeleteAccount || "";
    const label = button.dataset.adminDeleteLabel || "this account";
    openDeleteModal({
      title: "Delete account holder?",
      body: `This will permanently delete ${label} and its portal account record. This cannot be undone.`,
      action: () => deleteAccountHolder(userId)
    });
  });

  els.deleteCancel?.addEventListener("click", closeDeleteModal);
  els.deleteClose?.addEventListener("click", closeDeleteModal);
  els.deleteModal?.addEventListener("click", (event) => {
    if (event.target === els.deleteModal) closeDeleteModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.deleteModal?.hidden) closeDeleteModal();
  });
  els.deleteConfirm?.addEventListener("click", async () => {
    if (!pendingDeleteAction) return;
    setDeleteModalBusy(true);
    setDeleteModalError("");
    try {
      await pendingDeleteAction();
      closeDeleteModal();
    } catch (error) {
      setDeleteModalError(error?.message || "Delete failed. Check the Supabase RPC setup and try again.");
    } finally {
      setDeleteModalBusy(false);
    }
  });
}

function bindExportControls() {
  if (exportControlsBound) return;
  exportControlsBound = true;

  els.copySubscribers?.addEventListener("click", openExportModal);
  els.exportClose?.addEventListener("click", closeExportModal);
  els.exportCancel?.addEventListener("click", closeExportModal);
  els.exportModal?.addEventListener("click", (event) => {
    if (event.target === els.exportModal) closeExportModal();
  });
  els.exportFormats.forEach((input) => {
    input.addEventListener("change", () => updateExportPreview());
  });
  els.exportCopy?.addEventListener("click", copyExportPreview);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.exportModal?.hidden) closeExportModal();
  });
}

function setStatus(message) {
  if (!els.status) return;
  els.status.innerHTML = `<span class="material-symbols-outlined">lock</span>${escapeHtml(message)}`;
}

function setPanelStatus(element, message, visible = true) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-visible", visible && Boolean(message));
}

function setExportStatus(message, isError = false) {
  if (!els.exportStatus) return;
  els.exportStatus.textContent = message;
  els.exportStatus.classList.toggle("is-error", isError);
}

function showGate(message) {
  els.gate?.classList.add("is-visible");
  if (els.content) els.content.hidden = true;
  setStatus(message);
}

function showContent(user) {
  els.gate?.classList.remove("is-visible");
  if (els.content) els.content.hidden = false;
  currentAdminUserId = user.id || "";
  if (els.email) els.email.textContent = user.email || "";
  if (els.status) {
    els.status.innerHTML = `<span class="material-symbols-outlined">verified_user</span>${t.signedIn}`;
  }
  setActiveTab(location.hash || "overview", false);
}

function pickField(row, keys, fallback = "") {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return fallback;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(document.documentElement.lang || "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function normalizeAccountHolderRow(row) {
  return {
    user_id: pickField(row, ["user_id", "id"]),
    email: pickField(row, ["email"]),
    display_name: pickField(row, ["display_name", "full_name", "name"]),
    phone: pickField(row, ["phone"]),
    portal_role: pickField(row, ["portal_role", "role"]),
    created_at: pickField(row, ["created_at"]),
    last_sign_in_at: pickField(row, ["last_sign_in_at"]),
    confirmed_at: pickField(row, ["confirmed_at", "email_confirmed_at"])
  };
}

function normalizeMessageRow(row) {
  return {
    id: pickField(row, ["id", "message_id"]),
    user_id: pickField(row, ["user_id"]),
    email: pickField(row, ["email", "sender_email", "client_email"]),
    display_name: pickField(row, ["display_name", "sender_name", "full_name", "name"]),
    phone: pickField(row, ["phone", "sender_phone"]),
    request_type: pickField(row, ["request_type", "message_type", "type"], "Request"),
    subject: pickField(row, ["subject", "title", "topic"], "Message"),
    body: pickField(row, ["body", "message", "content", "details"]),
    status: pickField(row, ["status"], "New"),
    source: pickField(row, ["source", "direction"]),
    page_url: pickField(row, ["page_url", "url"]),
    attachments: normalizeAttachments(row?.attachments),
    created_at: pickField(row, ["created_at", "sent_at", "submitted_at"]),
    updated_at: pickField(row, ["updated_at"])
  };
}

function normalizeAttachments(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeNewsletterSignup(row) {
  const sourceValue = String(pickField(row, ["source"], "")).toLowerCase();
  const isAccountSignup = sourceValue.includes("portal_account") || sourceValue.includes("account");
  return {
    id: pickField(row, ["id"]),
    source: isAccountSignup ? "Account signup" : "Newsletter sign-up",
    name: pickField(row, ["display_name", "full_name", "name"]),
    email: pickField(row, ["email", "email_address"]),
    phone: pickField(row, ["phone"]),
    origin: pickField(row, ["page", "origin"], isAccountSignup ? "Client portal account" : "Homepage newsletter"),
    roleStatus: pickField(row, ["status"], "Newsletter subscriber"),
    created: pickField(row, ["created_at", "submitted_at"]),
    lastActivity: pickField(row, ["updated_at", "last_activity_at"]),
    priority: 1,
    canDeleteSubscriber: true
  };
}

function deleteButton({ type, value, label, disabled = false, title = "Delete record" }) {
  if (!value && !disabled) return "";
  const dataAttribute = type === "account"
    ? "data-admin-delete-account"
    : type === "message"
      ? "data-admin-delete-message"
      : "data-admin-delete-subscriber";
  const icon = disabled ? "lock" : "delete";
  return `
    <button
      class="client-admin-danger-button"
      type="button"
      ${dataAttribute}="${escapeHtml(value || "")}"
      data-admin-delete-label="${escapeHtml(label || "this record")}"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
      ${disabled ? "disabled" : ""}
    >
      <span class="material-symbols-outlined">${icon}</span>
      <span>${disabled ? "Protected" : "Delete"}</span>
    </button>
  `;
}

function pendingNewsletterSignupRow() {
  return {
    source: "Newsletter sign-up",
    name: "Capture source pending",
    email: "",
    phone: "",
    origin: "Add homepage newsletter form/table",
    roleStatus: "Not connected yet",
    created: "",
    lastActivity: "",
    priority: 0,
    isPlaceholder: true
  };
}

function mergeSubscriberRows(rows) {
  const mergedByEmail = new Map();
  const noEmailRows = [];

  rows.forEach((row) => {
    const emailKey = String(row.email || "").trim().toLowerCase();
    if (!emailKey) {
      noEmailRows.push(row);
      return;
    }
    const existing = mergedByEmail.get(emailKey);
    if (!existing) {
      mergedByEmail.set(emailKey, row);
      return;
    }
    const preferred = (row.priority || 0) >= (existing.priority || 0) ? row : existing;
    const secondary = preferred === row ? existing : row;
    mergedByEmail.set(emailKey, {
      ...preferred,
      source: preferred.source === secondary.source ? preferred.source : `${preferred.source} + ${secondary.source}`,
      name: preferred.name || secondary.name,
      phone: preferred.phone || secondary.phone,
      origin: preferred.origin || secondary.origin,
      roleStatus: "Newsletter subscriber",
      created: preferred.created || secondary.created,
      lastActivity: preferred.lastActivity || secondary.lastActivity,
      canDeleteSubscriber: Boolean(preferred.canDeleteSubscriber || secondary.canDeleteSubscriber)
    });
  });

  return [...mergedByEmail.values(), ...noEmailRows].sort((a, b) => {
    const aTime = new Date(a.created || a.lastActivity || 0).getTime();
    const bTime = new Date(b.created || b.lastActivity || 0).getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

function getSubscriberEmails() {
  const seen = new Set();
  const emails = [];
  currentSubscriberRows.forEach((row) => {
    if (row?.isPlaceholder) return;
    const email = String(row?.email || "").trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) return;
    seen.add(key);
    emails.push(email);
  });
  return emails;
}

function selectedExportFormat() {
  return els.exportFormats.find((input) => input.checked)?.value || "lines";
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function formatSubscriberEmails(format = selectedExportFormat()) {
  const emails = getSubscriberEmails();
  if (format === "comma") return emails.join(", ");
  if (format === "csv") return ["email", ...emails.map(csvCell)].join("\n");
  return emails.join("\n");
}

function updateSubscriberExportButton() {
  const emailCount = getSubscriberEmails().length;
  if (!els.copySubscribers) return;
  els.copySubscribers.disabled = emailCount === 0;
  els.copySubscribers.title = emailCount
    ? `Copy ${emailCount} subscriber email${emailCount === 1 ? "" : "s"}`
    : "No subscriber emails are available to copy yet.";
}

function updateExportPreview() {
  const emails = getSubscriberEmails();
  const formatted = formatSubscriberEmails();
  if (els.exportPreview) els.exportPreview.value = formatted;
  if (els.exportCount) {
    els.exportCount.textContent = `${emails.length} email${emails.length === 1 ? "" : "s"}`;
  }
  if (els.exportCopy) els.exportCopy.disabled = emails.length === 0;
  setExportStatus("");
}

function openExportModal() {
  updateExportPreview();
  if (!els.exportModal) return;
  els.exportModal.hidden = false;
  els.exportPreview?.focus();
  els.exportPreview?.select();
}

function closeExportModal() {
  if (els.exportModal) els.exportModal.hidden = true;
  setExportStatus("");
}

function copyTextWithSelection(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function selectExportPreview() {
  els.exportPreview?.focus();
  els.exportPreview?.select();
}

async function copyExportPreview() {
  const text = els.exportPreview?.value || "";
  if (!text.trim()) {
    setExportStatus("No emails to copy.", true);
    return;
  }
  try {
    const selectionCopied = copyTextWithSelection(text);
    if (!selectionCopied) {
      if (window.navigator?.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard unavailable");
      }
    }
    setExportStatus("Copied to clipboard.");
  } catch {
    selectExportPreview();
    setExportStatus("Clipboard blocked. The list is selected for manual copy.", true);
  }
}

function renderSubscribers(rows) {
  currentSubscriberRows = rows.filter((row) => !row.isPlaceholder && row.email);
  updateSubscriberExportButton();
  const subscriberCount = rows.filter((row) => !row.isPlaceholder).length;
  if (els.subscribersCount) {
    els.subscribersCount.textContent = `${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`;
  }
  if (!els.subscribersTable) return;
  if (!rows.length) {
    els.subscribersTable.innerHTML = `<tr><td colspan="9"><div class="client-admin-empty">${escapeHtml(t.noSubscribers)}</div></td></tr>`;
    return;
  }
  els.subscribersTable.innerHTML = rows.map((row) => {
    const label = row.email || row.name || "this subscriber";
    const action = row.isPlaceholder
      ? ""
      : !row.canDeleteSubscriber
        ? deleteButton({
          type: "subscriber",
          value: row.email,
          label,
          disabled: true,
          title: "This portal account appears here as a subscriber, but its newsletter row has not been mirrored yet."
        })
      : deleteButton({
        type: "subscriber",
        value: row.email,
        label,
        title: `Delete subscriber ${label}`
      });
    return `
      <tr>
        <td class="client-admin-table-cell--source"><span class="client-pill">${escapeHtml(row.source)}</span></td>
        <td class="client-admin-table-cell--name"><strong>${escapeHtml(row.name || "Unknown")}</strong></td>
        <td class="client-admin-table-cell--email">${escapeHtml(row.email || "")}</td>
        <td>${escapeHtml(row.phone || "")}</td>
        <td>${escapeHtml(row.origin || "")}</td>
        <td>${escapeHtml(row.roleStatus || "")}</td>
        <td>${escapeHtml(formatDateTime(row.created))}</td>
        <td>${escapeHtml(formatDateTime(row.lastActivity))}</td>
        <td>${action}</td>
      </tr>
    `;
  }).join("");
}

function renderMessages(rows) {
  if (!els.messagesTable) return;
  if (els.messagesCount) {
    els.messagesCount.textContent = `${rows.length} message${rows.length === 1 ? "" : "s"}`;
  }
  if (!rows.length) {
    els.messagesTable.innerHTML = `<tr><td colspan="7"><div class="client-admin-empty">${escapeHtml(t.noMessages)}</div></td></tr>`;
    return;
  }
  els.messagesTable.innerHTML = rows.map((sourceRow) => {
    const row = normalizeMessageRow(sourceRow);
    const clientLabel = row.email || row.display_name || "Client";
    const body = row.body || "";
    const contactLines = [
      row.email ? `<div class="client-muted">${escapeHtml(row.email)}</div>` : "",
      row.phone ? `<div class="client-muted">${escapeHtml(row.phone)}</div>` : "",
      row.user_id ? `<div class="client-muted">${escapeHtml(row.user_id)}</div>` : ""
    ].join("");
    const sourceLine = row.source ? `<div class="client-muted">${escapeHtml(row.source)}</div>` : "";
    const pageLine = row.page_url ? `<a class="client-admin-message-link" href="${escapeHtml(row.page_url)}" target="_blank" rel="noopener">Source page</a>` : "";
    return `
      <tr>
        <td><strong>${escapeHtml(row.display_name || "Website visitor")}</strong>${contactLines}</td>
        <td><span class="client-pill">${escapeHtml(row.request_type || "Request")}</span>${sourceLine}</td>
        <td><strong>${escapeHtml(row.subject || "Message")}</strong></td>
        <td><div class="client-admin-message-body">${escapeHtml(body)}</div>${attachmentListHtml(row.attachments)}${pageLine}</td>
        <td>${escapeHtml(row.status || "New")}</td>
        <td>${escapeHtml(formatDateTime(row.created_at || row.updated_at))}</td>
        <td>${deleteButton({
          type: "message",
          value: row.id,
          label: `${clientLabel} message`,
          title: `Delete message from ${clientLabel}`
        })}</td>
      </tr>
    `;
  }).join("");
}

function attachmentListHtml(attachments) {
  if (!attachments.length) return "";
  const items = attachments.map((attachment) => {
    const label = attachment.name || attachment.path || "Attachment";
    const href = attachment.signed_url || attachment.signedUrl || attachment.url || "";
    if (!href) return `<span class="client-admin-attachment"><span class="material-symbols-outlined">image</span>${escapeHtml(label)}</span>`;
    return `<a class="client-admin-attachment" href="${escapeHtml(href)}" target="_blank" rel="noopener"><span class="material-symbols-outlined">image</span>${escapeHtml(label)}</a>`;
  }).join("");
  return `<div class="client-admin-attachments">${items}</div>`;
}

function renderAccountHolders(rows) {
  if (!els.accountHoldersTable) return;
  if (els.accountHoldersCount) {
    els.accountHoldersCount.textContent = `${rows.length} record${rows.length === 1 ? "" : "s"}`;
  }
  if (!rows.length) {
    els.accountHoldersTable.innerHTML = `<tr><td colspan="7"><div class="client-admin-empty">${escapeHtml(t.noAccountHolders)}</div></td></tr>`;
    return;
  }
  els.accountHoldersTable.innerHTML = rows.map((sourceRow) => {
    const row = normalizeAccountHolderRow(sourceRow);
    const name = row.display_name || "Account holder";
    const label = row.email || name;
    const isCurrentAdmin = currentAdminUserId && row.user_id === currentAdminUserId;
    return `
      <tr>
        <td class="client-admin-table-cell--name"><strong>${escapeHtml(name)}</strong>${row.user_id ? `<div class="client-muted">${escapeHtml(row.user_id)}</div>` : ""}</td>
        <td class="client-admin-table-cell--email">${escapeHtml(row.email || "")}</td>
        <td>${escapeHtml(row.phone || "")}</td>
        <td><span class="client-pill">${escapeHtml(row.portal_role || "client")}</span></td>
        <td>${escapeHtml(formatDateTime(row.created_at))}</td>
        <td>${escapeHtml(formatDateTime(row.last_sign_in_at || row.confirmed_at))}</td>
        <td>${deleteButton({
          type: "account",
          value: row.user_id,
          label,
          disabled: isCurrentAdmin,
          title: isCurrentAdmin ? "You cannot delete the signed-in owner account here." : `Delete account ${label}`
        })}</td>
      </tr>
    `;
  }).join("");
}

function openDeleteModal({ title, body, action }) {
  pendingDeleteAction = action;
  if (els.deleteTitle) els.deleteTitle.textContent = title;
  if (els.deleteBody) els.deleteBody.textContent = body;
  setDeleteModalError("");
  setDeleteModalBusy(false);
  if (els.deleteModal) {
    els.deleteModal.hidden = false;
    els.deleteConfirm?.focus();
  }
}

function closeDeleteModal() {
  if (els.deleteModal) els.deleteModal.hidden = true;
  pendingDeleteAction = null;
  setDeleteModalError("");
  setDeleteModalBusy(false);
}

function setDeleteModalError(message) {
  if (!els.deleteError) return;
  els.deleteError.textContent = message;
  els.deleteError.hidden = !message;
}

function setDeleteModalBusy(isBusy) {
  if (!els.deleteConfirm) return;
  els.deleteConfirm.disabled = isBusy;
  els.deleteConfirm.classList.toggle("is-loading", isBusy);
}

async function deleteNewsletterSubscriber(email) {
  if (!adminSupabase) throw new Error("Admin session is not ready.");
  setPanelStatus(els.subscribersStatus, t.deletingSubscriber);
  const { error } = await adminSupabase.rpc("delete_newsletter_subscriber", { target_email: email });
  if (error) {
    setPanelStatus(els.subscribersStatus, error.message || t.deleteSubscriberSetup);
    throw error;
  }
  await loadSubscribers(adminSupabase);
}

async function deleteAccountHolder(userId) {
  if (!adminSupabase) throw new Error("Admin session is not ready.");
  if (currentAdminUserId && userId === currentAdminUserId) {
    throw new Error("You cannot delete the signed-in owner account.");
  }
  setPanelStatus(els.accountHoldersStatus, t.deletingAccountHolder);
  const { error } = await adminSupabase.rpc("delete_portal_account_holder", { target_user_id: userId });
  if (error) {
    setPanelStatus(els.accountHoldersStatus, error.message || t.deleteAccountSetup);
    throw error;
  }
  await loadAccountHolders(adminSupabase);
  if (subscribersLoaded) await loadSubscribers(adminSupabase);
}

async function deletePortalMessage(messageId) {
  if (!adminSupabase) throw new Error("Admin session is not ready.");
  setPanelStatus(els.messagesStatus, t.deletingMessage);
  const { error } = await adminSupabase.rpc("delete_portal_message", { target_message_id: messageId });
  if (error) {
    setPanelStatus(els.messagesStatus, error.message || t.deleteMessageSetup);
    throw error;
  }
  await loadMessages(adminSupabase);
}

async function signMessageAttachments(row, supabase) {
  const attachments = normalizeAttachments(row?.attachments);
  if (!attachments.length || !supabase?.storage) return row;
  const signedAttachments = await Promise.all(attachments.map(async (attachment) => {
    if (!attachment?.path) return attachment;
    const bucket = attachment.bucket || "portal-message-attachments";
    try {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(attachment.path, 60 * 60);
      if (error) throw error;
      return { ...attachment, signed_url: data?.signedUrl || "" };
    } catch {
      return attachment;
    }
  }));
  return { ...row, attachments: signedAttachments };
}

async function signMessageAttachmentRows(rows, supabase) {
  return Promise.all(rows.map((row) => signMessageAttachments(row, supabase)));
}

async function loadMessages(supabase) {
  setPanelStatus(els.messagesStatus, t.loadingMessages);
  try {
    const { data, error } = await supabase.rpc("list_portal_messages");
    if (error) throw error;
    const rows = await signMessageAttachmentRows(Array.isArray(data) ? data : [], supabase);
    renderMessages(rows);
    setPanelStatus(els.messagesStatus, "", false);
  } catch (error) {
    renderMessages([]);
    setPanelStatus(els.messagesStatus, error?.message || t.messagesSetup);
  }
}

async function loadAccountHolders(supabase) {
  if (!els.accountHoldersPanel) return;
  els.accountHoldersPanel.hidden = false;
  setPanelStatus(els.accountHoldersStatus, t.loadingAccountHolders);

  try {
    const { data, error } = await supabase.rpc("list_portal_account_holders");
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    renderAccountHolders(rows);
    setPanelStatus(els.accountHoldersStatus, "", false);
  } catch (rpcError) {
    try {
      const table = config.tables?.profile || "client_profiles";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];
      renderAccountHolders(rows);
      setPanelStatus(els.accountHoldersStatus, rows.length ? t.accountHoldersSetup : t.noAccountHolders);
    } catch {
      renderAccountHolders([]);
      setPanelStatus(els.accountHoldersStatus, rpcError?.message || t.accountHoldersSetup);
    }
  } finally {
  }
}

async function loadNewsletterSignups(supabase) {
  const table = config.tables?.homepageEmailSignups || "homepage_email_signups";
  try {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return {
      rows: (Array.isArray(data) ? data : []).map(normalizeNewsletterSignup).filter((row) => row.email),
      connected: true
    };
  } catch {
    return { rows: [], connected: false };
  }
}

async function loadSubscribers(supabase) {
  setPanelStatus(els.subscribersStatus, t.loadingSubscribers);
  const newsletterResult = await loadNewsletterSignups(supabase);
  const rows = mergeSubscriberRows(newsletterResult.rows);
  const statusMessages = [];
  if (!newsletterResult.connected) {
    rows.push(pendingNewsletterSignupRow());
    statusMessages.push(t.homepagePending);
    statusMessages.push(t.accountSignupPending);
  }
  renderSubscribers(rows);
  setPanelStatus(els.subscribersStatus, statusMessages.join(" "), statusMessages.length > 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

bindTabControls();
bindDeleteControls();
bindExportControls();

if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT_REF")) {
  showGate(t.setupPending);
} else {
  const supabase = createClient(config.url, config.anonKey);
  adminSupabase = supabase;
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    try { localStorage.removeItem("dm_logged_in"); } catch (e) {}
    showGate(t.loginRequired);
  } else {
    const profileRole = await resolveProfilePortalRole(supabase, data.session.user, config);
    if (!isSuperAdminUser(data.session.user, config, profileRole)) {
      showGate(t.notAuthorized);
    } else {
      try { localStorage.setItem("dm_logged_in", "1"); } catch (e) {}
      showContent(data.session.user);

    }

    els.signOut?.addEventListener("click", async () => {
      await supabase.auth.signOut();
      try { localStorage.removeItem("dm_logged_in"); } catch (e) {}
      showGate(t.loginRequired);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      try {
        if (session) localStorage.setItem("dm_logged_in", "1");
        else localStorage.removeItem("dm_logged_in");
      } catch (e) {}
      if (!session) showGate(t.loginRequired);
    });
  }
}
