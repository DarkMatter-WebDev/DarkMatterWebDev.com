import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { canOpenSeanAdsPortal, isSuperAdminUser, resolveProfilePortalRole } from "./portal-auth.js";

const config = window.DM_SUPABASE_CONFIG || {};
const copy = window.DM_CLIENT_PORTAL_COPY || {};
const isConfigured = Boolean(
  config.url &&
  config.anonKey &&
  !config.url.includes("YOUR_PROJECT_REF") &&
  !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
);

const els = {
  form: document.querySelector("[data-client-login-form]"),
  email: document.querySelector("[data-client-email]"),
  password: document.querySelector("[data-client-password]"),
  signupOpen: document.querySelector("[data-client-signup-open]"),
  signupModal: document.querySelector("[data-client-signup-modal]"),
  signupClose: document.querySelectorAll("[data-client-signup-close]"),
  signupForm: document.querySelector("[data-client-signup-form]"),
  signupName: document.querySelector("[data-signup-name]"),
  signupEmail: document.querySelector("[data-signup-email]"),
  signupPassword: document.querySelector("[data-signup-password]"),
  signupPasswordConfirm: document.querySelector("[data-signup-password-confirm]"),
  signupStatus: document.querySelector("[data-signup-status]"),
  signupResetBtn: document.querySelector("[data-signup-reset-btn]"),
  forgotPassword: document.querySelector("#forgot-pw-btn"),
  magic: document.querySelector("[data-client-magic]"),
  status: document.querySelector("[data-client-status]"),
  introPanel: document.querySelector("[data-client-intro]"),
  portalGrid: document.querySelector(".client-portal-grid"),
  authPanel: document.querySelector("[data-auth-panel]"),
  dashboard: document.querySelector("[data-client-dashboard]"),
  accountEmail: document.querySelector("[data-account-email]"),
  signOut: document.querySelector("[data-client-signout]"),
  services: document.querySelector("[data-client-services]"),
  invoices: document.querySelector("[data-client-invoices]"),
  documents: document.querySelector("[data-client-documents]"),
  messages: document.querySelector("[data-client-messages]"),
  requestForm: document.querySelector("[data-client-request-form]"),
  requestEmail: document.querySelector("[data-request-email]"),
  requestStatus: document.querySelector("[data-request-status]"),
  metricServices: document.querySelector("[data-metric-services]"),
  metricDocuments: document.querySelector("[data-metric-documents]"),
  metricMessages: document.querySelector("[data-metric-messages]"),
  metricInvoices: document.querySelector("[data-metric-invoices]"),
  metricBilling: document.querySelector("[data-metric-billing]"),
  metricSupport: document.querySelector("[data-metric-support]"),
  seansAdsBanner: document.querySelector("[data-seansads-banner]"),
  navLoginLinks: document.querySelectorAll(".nav-login-link"),
  seanAdsPortalPanel: document.querySelector("[data-sean-ads-portal-panel]"),
  adminCenterLink: document.querySelector("[data-admin-center-link]")
};

const portalNext = {
  storageKey: "dm_portal_next",
  path: ""
};

function getSafePortalNext(value) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return "";
    const path = `${url.pathname}${url.search}${url.hash}`;
    const isEnglishCheckout = path.startsWith("/app-checkout.html");
    const isSpanishCheckout = path.startsWith("/es/app-checkout.html");
    const isEnglishSettings = path.startsWith("/account-settings.html");
    const isSpanishSettings = path.startsWith("/es/account-settings.html");
    const isEnglishAdsDashboard = path.startsWith("/seans-google-ads-dashboard.html");
    const isSpanishAdsDashboard = path.startsWith("/es/seans-google-ads-dashboard.html");
    return isEnglishCheckout || isSpanishCheckout || isEnglishAdsDashboard || isSpanishAdsDashboard || isEnglishSettings || isSpanishSettings ? path : "";
  } catch {
    return "";
  }
}

function getStoredPortalNext() {
  try {
    return getSafePortalNext(window.sessionStorage.getItem(portalNext.storageKey) || "");
  } catch {
    return "";
  }
}

function setStoredPortalNext(path) {
  try {
    if (path) window.sessionStorage.setItem(portalNext.storageKey, path);
  } catch {
    // Session storage is optional; password login still works without it.
  }
}

function clearStoredPortalNext() {
  try {
    window.sessionStorage.removeItem(portalNext.storageKey);
  } catch {
    // Ignore storage errors.
  }
}

function getAccountRedirectUrl() {
  const accountPath = document.documentElement.lang.startsWith("es") ? "/es/account.html" : "/account.html";
  const url = new URL(accountPath, getAuthRedirectOrigin());
  const next = portalNext.path || getStoredPortalNext();
  if (next) url.searchParams.set("next", next);
  return url.href;
}

function getPasswordResetRedirectUrl() {
  const settingsPath = document.documentElement.lang.startsWith("es") ? "/es/account-settings.html" : "/account-settings.html";
  return new URL(settingsPath, getAuthRedirectOrigin()).href;
}

function getAuthRedirectOrigin() {
  const configuredUrl = String(config.siteUrl || "").trim().replace(/\/+$/, "");
  if (configuredUrl) return configuredUrl;
  return window.location.origin;
}

function maybeRedirectToPortalNext() {
  const next = portalNext.path || getStoredPortalNext();
  if (!next) return false;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current === next) return false;
  clearStoredPortalNext();
  window.location.href = next;
  return true;
}

try {
  const params = new URLSearchParams(window.location.search);
  const emailParam = params.get("email");
  if (emailParam && els.email && !els.email.value) els.email.value = emailParam;
  portalNext.path = getSafePortalNext(params.get("next"));
  if (portalNext.path) setStoredPortalNext(portalNext.path);
  const source = (params.get("source") || "").toLowerCase();
  const referrer = document.referrer || "";
  if (els.seansAdsBanner && (source === "seansads" || referrer.includes("seansads.com"))) {
    els.seansAdsBanner.hidden = false;
  }
} catch {
  // Ignore malformed query strings; the form still works without prefill or source hints.
}

const t = {
  notConfigured: copy.notConfigured || "Client portal setup is ready. Add your Supabase URL and anon key in assets/supabase-config.js to enable login.",
  checkEmail: copy.checkEmail || "Check your email for the secure login link.",
  accountCreated: copy.accountCreated || "Account created. Check your email to confirm your login, then we will connect your client records.",
  accountCreatedSignedIn: copy.accountCreatedSignedIn || "Account created. You are signed in now.",
  nameRequired: copy.nameRequired || "Enter your full name.",
  emailRequired: copy.emailRequired || "Enter your email address.",
  emailInvalid: copy.emailInvalid || "Enter a valid email address.",
  passwordRequired: copy.passwordRequired || "Create a password.",
  passwordTooShort: copy.passwordTooShort || "Password must be at least 6 characters.",
  passwordConfirmRequired: copy.passwordConfirmRequired || "Confirm your password.",
  passwordMismatch: copy.passwordMismatch || "Passwords do not match.",
  signedIn: copy.signedIn || "Signed in.",
  signedOut: copy.signedOut || "Signed out.",
  error: copy.error || "Something went wrong. Please try again.",
  noServices: copy.noServices || "No active services are connected to this account yet.",
  noInvoices: copy.noInvoices || "No invoices are connected to this account yet.",
  noDocuments: copy.noDocuments || "No shared documents are available in your portal yet.",
  noMessages: copy.noMessages || "No portal messages are available yet.",
  visitors: copy.visitors || "Visitors",
  pageViews: copy.pageViews || "Page views",
  topPage: copy.topPage || "Top page",
  topReferrer: copy.topReferrer || "Top referrer",
  source: copy.source || "Source",
  requestSending: copy.requestSending || "Sending your request...",
  requestSent: copy.requestSent || "Request sent. We will review it and follow up soon.",
  requestSetup: copy.requestSetup || "Install the submit_portal_message() Supabase RPC to send account requests here.",
  loadingAccountHolders: copy.loadingAccountHolders || "Loading account holders from Supabase...",
  noAccountHolders: copy.noAccountHolders || "No account holders were returned from Supabase.",
  accountHoldersSetup: copy.accountHoldersSetup || "Install the list_portal_account_holders() Supabase RPC to view auth account emails here.",
  active: copy.active || "Active",
  pending: copy.pending || "Pending",
  billingPortalPending: copy.billingPortalPending || "Billing portal connection is ready to wire to Stripe once the secure server function is added.",
  accountExists: copy.accountExists || "An account with this email already exists. If you forgot your password, request a reset link below.",
  accountExistsReset: copy.accountExistsReset || "Password reset email sent. Check your inbox."
};

function setStatus(message, visible = true) {
  if (!els.status) return;
  els.status.textContent = message;
  els.status.classList.toggle("is-visible", visible);
}

function setLoading(isLoading) {
  document.querySelectorAll("[data-client-action]").forEach((button) => {
    button.disabled = isLoading || !isConfigured;
  });
}

function setSignupLoading(isLoading) {
  const button = document.querySelector("[data-signup-submit]");
  if (button) button.disabled = isLoading || !isConfigured;
}

function setSignupStatus(message, visible = true, showResetBtn = false) {
  if (!els.signupStatus) return;
  els.signupStatus.textContent = message;
  els.signupStatus.classList.toggle("is-visible", visible);
  if (els.signupResetBtn) {
    els.signupResetBtn.style.display = showResetBtn ? "inline-flex" : "none";
  }
}

function setPanelStatus(element, message, visible = true) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-visible", visible);
}

function openSignupModal() {
  if (!els.signupModal) return;
  els.signupModal.hidden = false;
  setSignupStatus("", false);
  if (els.signupEmail && els.email?.value) els.signupEmail.value = els.email.value.trim();
  window.setTimeout(() => els.signupEmail?.focus(), 50);
}

function closeSignupModal() {
  if (!els.signupModal) return;
  els.signupModal.hidden = true;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateSignupForm() {
  const name = els.signupName?.value.trim() || "";
  const email = els.signupEmail?.value.trim() || "";
  const password = els.signupPassword?.value || "";
  const passwordConfirm = els.signupPasswordConfirm?.value || "";

  if (!email) return t.emailRequired;
  if (!isValidEmail(email)) return t.emailInvalid;
  if (!password) return t.passwordRequired;
  if (password.length < 6) return t.passwordTooShort;
  if (!passwordConfirm) return t.passwordConfirmRequired;
  if (password !== passwordConfirm) return t.passwordMismatch;
  return "";
}

function pickField(row, keys, fallback = "") {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return fallback;
}

function renderList(container, rows, fallback, type) {
  if (!container) return;
  if (!rows || rows.length === 0) {
    container.innerHTML = `<div class="client-list-item"><span class="client-muted">${fallback}</span></div>`;
    return;
  }

  container.innerHTML = rows.map((row) => {
    const title = row.name || row.service_name || row.plan_name || row.title || "Client service";
    const detail = row.description || row.billing_period || row.next_invoice_label || row.status || "";
    const status = row.status || t.active;
    return `
      <div class="client-list-item">
        <div>
          <strong>${escapeHtml(title)}</strong>
          ${detail ? `<div class="client-muted">${escapeHtml(detail)}</div>` : ""}
        </div>
        <span class="client-pill">${escapeHtml(status)}</span>
      </div>
    `;
  }).join("");
}

function renderInvoices(container, rows) {
  if (!container) return;
  if (!rows || rows.length === 0) {
    container.innerHTML = `<div class="client-list-item"><span class="client-muted">${t.noInvoices}</span></div>`;
    return;
  }

  container.innerHTML = rows.map((row) => {
    const title = pickField(row, ["invoice_number", "title", "name", "plan_name"], "Invoice");
    const amount = pickField(row, ["amount", "total", "balance_due"]);
    const dueDate = pickField(row, ["due_date", "due_at", "next_invoice_label"]);
    const detailParts = [amount ? `Amount: ${amount}` : "", dueDate ? `Due: ${dueDate}` : ""].filter(Boolean);
    const detail = detailParts.join(" · ") || pickField(row, ["description", "billing_period", "notes"]);
    const status = pickField(row, ["status"], t.pending);
    return `
      <div class="client-list-item">
        <div>
          <strong>${escapeHtml(title)}</strong>
          ${detail ? `<div class="client-muted">${escapeHtml(detail)}</div>` : ""}
        </div>
        <span class="client-pill">${escapeHtml(status)}</span>
      </div>
    `;
  }).join("");
}

function renderDocuments(container, rows) {
  if (!container) return;
  if (!rows || rows.length === 0) {
    container.innerHTML = `<div class="client-list-item"><span class="client-muted">${t.noDocuments}</span></div>`;
    return;
  }

  container.innerHTML = rows.map((row) => {
    const title = pickField(row, ["title", "name", "file_name", "document_name"], "Document");
    const docType = pickField(row, ["document_type", "doc_type", "category"]);
    const fileUrl = pickField(row, ["file_url", "url", "public_url"]);
    const notes = pickField(row, ["description", "notes", "summary"]);
    return `
      <article class="client-health-card">
        <div class="client-health-card__top">
          <div>
            <strong>${escapeHtml(title)}</strong>
            ${docType ? `<div class="client-muted">${escapeHtml(docType)}</div>` : ""}
            ${fileUrl ? `<a href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener" class="client-health-url">Open document</a>` : ""}
          </div>
          <span class="client-pill">${escapeHtml(pickField(row, ["status"], t.active))}</span>
        </div>
        ${notes ? `<p class="client-muted">${escapeHtml(notes)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function renderMessages(container, rows) {
  if (!container) return;
  if (!rows || rows.length === 0) {
    container.innerHTML = `<div class="client-list-item"><span class="client-muted">${t.noMessages}</span></div>`;
    return;
  }

  container.innerHTML = rows.map((row) => {
    const subject = pickField(row, ["subject", "title", "topic"], "Message");
    const body = pickField(row, ["body", "message", "content", "details"]);
    const preview = body ? String(body).slice(0, 180) : "";
    const status = pickField(row, ["status"], t.active);
    const created = pickField(row, ["created_at", "sent_at", "updated_at"]);
    const createdLabel = created ? new Date(created).toLocaleString(document.documentElement.lang || "en") : "";
    return `
      <article class="client-stats-card">
        <div class="client-health-card__top">
          <div>
            <strong>${escapeHtml(subject)}</strong>
            ${createdLabel ? `<div class="client-muted">${escapeHtml(createdLabel)}</div>` : ""}
          </div>
          <span class="client-pill">${escapeHtml(status)}</span>
        </div>
        ${preview ? `<p class="client-muted">${escapeHtml(preview)}${String(body).length > 180 ? "…" : ""}</p>` : ""}
      </article>
    `;
  }).join("");
}

function countOpenInvoices(rows) {
  return rows.filter((row) => {
    const status = String(pickField(row, ["status"], "")).toLowerCase();
    return !status || !/(paid|complete|closed|void)/i.test(status);
  }).length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function maybeQuery(supabase, table, userId) {
  if (!table) return [];
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

async function renderDashboard(supabase, session) {
  const user = session?.user;
  if (!user) return;
  // Persist the signed-in flag the instant a session exists, before any
  // post-login redirect (magic link / ?next=) can navigate away. Otherwise the
  // flag would never be set on flows that redirect straight to checkout.
  try { localStorage.setItem("dm_logged_in", "1"); } catch (e) {}
  if (maybeRedirectToPortalNext()) return;
  updateAccountNav(true);

  if (els.dashboard) {
    els.portalGrid?.classList.add("is-authenticated");
    els.introPanel?.setAttribute("hidden", "");
    els.authPanel?.setAttribute("hidden", "");
    els.dashboard.classList.add("is-visible");
  } else {
    setStatus(t.signedIn);
  }
  if (els.accountEmail) els.accountEmail.textContent = user.email || "";
  const profileRole = await resolveProfilePortalRole(supabase, user, config);
  const isSuperAdmin = isSuperAdminUser(user, config, profileRole);
  const canAccessSeanPortal = canOpenSeanAdsPortal(user, config, profileRole);
  if (els.adminCenterLink) {
    els.adminCenterLink.hidden = !isSuperAdmin;
  }
  if (els.seanAdsPortalPanel) {
    els.seanAdsPortalPanel.hidden = !canAccessSeanPortal || isSuperAdmin;
  }

  const [services, invoices, documents, messages] = await Promise.all([
    maybeQuery(supabase, config.tables?.services, user.id),
    maybeQuery(supabase, config.tables?.invoices, user.id),
    maybeQuery(supabase, config.tables?.documents, user.id),
    maybeQuery(supabase, config.tables?.messages, user.id)
  ]);

  renderList(els.services, services, t.noServices, "services");
  renderInvoices(els.invoices, invoices);
  renderDocuments(els.documents, documents);
  renderMessages(els.messages, messages);

  if (els.requestEmail) els.requestEmail.value = user.email || "";

  if (els.metricServices) els.metricServices.textContent = String(services.length);
  if (els.metricDocuments) els.metricDocuments.textContent = String(documents.length);
  if (els.metricMessages) els.metricMessages.textContent = String(messages.length);
  if (els.metricInvoices) els.metricInvoices.textContent = String(invoices.length);
  if (els.metricBilling) {
    const openInvoices = countOpenInvoices(invoices);
    els.metricBilling.textContent = invoices.length ? (openInvoices ? String(openInvoices) : t.active) : t.pending;
  }
  if (els.metricSupport) els.metricSupport.textContent = services.some((item) => /support|care|help/i.test(item.name || item.service_name || "")) ? t.active : t.pending;
}

function renderSignedOut() {
  els.portalGrid?.classList.remove("is-authenticated");
  els.introPanel?.removeAttribute("hidden");
  els.authPanel?.removeAttribute("hidden");
  els.dashboard?.classList.remove("is-visible");
  if (els.seanAdsPortalPanel) els.seanAdsPortalPanel.hidden = true;
  if (els.adminCenterLink) els.adminCenterLink.hidden = true;
  updateAccountNav(false);
}

function updateAccountNav(isSignedIn) {
  // Single source of truth read by account-nav.js on every other page.
  try {
    if (isSignedIn) localStorage.setItem("dm_logged_in", "1");
    else localStorage.removeItem("dm_logged_in");
  } catch (e) {}
  const isSpanish = document.documentElement.lang.startsWith("es");
  const label = isSignedIn ? (isSpanish ? "Cuenta" : "Account") : (isSpanish ? "Acceso" : "Client Login");
  const iconName = "account_circle";
  const mobileAccountColor = isSignedIn ? "#00F0FF" : "rgba(196, 199, 199, 0.55)";

  els.navLoginLinks?.forEach((link) => {
    const icon = link.querySelector(".material-symbols-outlined");
    link.textContent = "";
    if (icon) {
      icon.textContent = iconName;
      link.append(icon);
    }
    if (link.classList.contains("dm-mob-acct")) {
      link.setAttribute("aria-label", label);
      link.setAttribute("title", label);
      link.dataset.dmSignedIn = isSignedIn ? "true" : "false";
      link.style.color = mobileAccountColor;
      link.style.opacity = isSignedIn ? "1" : "0.92";
    } else {
      link.append(document.createTextNode(label));
    }
  });
}

if (!isConfigured) {
  setStatus(t.notConfigured);
  setLoading(true);
} else {
  const supabase = createClient(config.url, config.anonKey);

  supabase.auth.getSession().then(({ data }) => {
    if (data.session) renderDashboard(supabase, data.session);
    else renderSignedOut();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) renderDashboard(supabase, session);
    else renderSignedOut();
  });

  els.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoading(true);
    const email = els.email?.value.trim();
    const password = els.password?.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setStatus(error.message || t.error);
    else setStatus(t.signedIn);
  });

  els.magic?.addEventListener("click", async () => {
    setLoading(true);
    const email = els.email?.value.trim();
    const redirectTo = getAccountRedirectUrl();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setLoading(false);
    if (error) setStatus(error.message || t.error);
    else setStatus(t.checkEmail);
  });

  els.signupOpen?.addEventListener("click", openSignupModal);
  els.signupClose?.forEach((button) => button.addEventListener("click", closeSignupModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSignupModal();
  });

  els.signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validationMessage = validateSignupForm();
    if (validationMessage) {
      setSignupStatus(validationMessage);
      return;
    }

    const email = els.signupEmail?.value.trim();
    const password = els.signupPassword?.value;
    setSignupLoading(true);
    const redirectTo = getAccountRedirectUrl();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          display_name: els.signupName?.value.trim() || ""
        }
      }
    });
    setSignupLoading(false);
    if (error) {
      const msg = (error.message || "").toLowerCase();
      const isExisting =
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        error.code === "user_already_exists";
      if (isExisting) {
        setSignupStatus(t.accountExists, true, true);
      } else {
        setSignupStatus(error.message || t.error);
      }
    } else {
      // Supabase anti-enumeration: signUp returns success but empty identities
      // array when the email is already in use.
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setSignupStatus(t.accountExists, true, true);
        return;
      }
      if (!data?.session) {
        const successPath = copy.signupSuccessUrl || (document.documentElement.lang.startsWith("es") ? "/es/account-created.html" : "/account-created.html");
        const successUrl = new URL(successPath, window.location.origin);
        if (email) successUrl.searchParams.set("email", email);
        window.location.href = successUrl.href;
        return;
      }
      setSignupStatus(t.accountCreatedSignedIn);
      els.signupForm.reset();
      window.setTimeout(closeSignupModal, 900);
    }
  });

  els.signupResetBtn?.addEventListener("click", async () => {
    const email = els.signupEmail?.value.trim();
    if (!email) return;
    els.signupResetBtn.disabled = true;
    const redirectTo = getPasswordResetRedirectUrl();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    els.signupResetBtn.disabled = false;
    if (resetError) {
      setSignupStatus(resetError.message || t.error, true, true);
    } else {
      setSignupStatus(t.accountExistsReset, true, false);
    }
  });

  els.forgotPassword?.addEventListener("click", async () => {
    const email = els.email?.value.trim();
    if (!email) {
      setStatus(t.emailRequired);
      els.email?.focus();
      return;
    }
    if (!isValidEmail(email)) {
      setStatus(t.emailInvalid);
      els.email?.focus();
      return;
    }

    els.forgotPassword.disabled = true;
    const redirectTo = getPasswordResetRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    els.forgotPassword.disabled = false;
    if (error) setStatus(error.message || t.error);
    else setStatus(t.accountExistsReset);
  });

  els.signOut?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    // Clear the nav flag immediately so other pages flip back to "Client Login"
    // right away, without waiting for the async auth state change to propagate.
    try { localStorage.removeItem("dm_logged_in"); } catch (e) {}
    setStatus(t.signedOut);
  });

  els.requestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!els.requestStatus) return;
    els.requestStatus.textContent = t.requestSending;
    els.requestStatus.classList.add("is-visible");

    const formData = new FormData(els.requestForm);
    const subject = String(formData.get("subject") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const requestType = String(formData.get("request_type") || "").trim();
    if (!subject || !details) {
      els.requestStatus.textContent = t.error;
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Signed-in session required");

      const { error } = await supabase.rpc("submit_portal_message", {
        portal_request_type: requestType,
        message_subject: subject,
        message_details: details
      });
      if (error) throw error;
      els.requestForm.reset();
      if (els.requestEmail && els.accountEmail?.textContent) els.requestEmail.value = els.accountEmail.textContent;
      els.requestStatus.textContent = t.requestSent;
      await renderDashboard(supabase, sessionData.session);
    } catch (error) {
      els.requestStatus.textContent = /submit_portal_message/i.test(error?.message || "") ? t.requestSetup : (error?.message || t.error);
    }
  });
}
