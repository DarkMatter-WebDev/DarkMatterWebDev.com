import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { isSuperAdminUser, resolveProfilePortalRole } from "./portal-auth.js";

const config = window.DM_SUPABASE_CONFIG || {};
const isSpanish = document.documentElement.lang.startsWith("es");
const accountPath = isSpanish ? "/es/account.html" : "/account.html";

const els = {
  gate: document.querySelector("[data-users-gate]"),
  content: document.querySelector("[data-users-content]"),
  loginLink: document.querySelector("[data-users-login-link]"),
  email: document.querySelector("[data-users-email]"),
  sessionStatus: document.querySelector("[data-users-session-status]"),
  signOut: document.querySelector("[data-users-signout]"),
  load: document.querySelector("[data-master-users-load]"),
  status: document.querySelector("[data-master-users-status]"),
  table: document.querySelector("[data-master-users-table]"),
  count: document.querySelector("[data-master-users-count]")
};

const nextPath = `${location.pathname}${location.search}${location.hash}`;
const loginUrl = new URL(accountPath, location.origin);
loginUrl.searchParams.set("next", nextPath);
if (els.loginLink) els.loginLink.href = loginUrl.href;

const t = {
  setupPending: "Add Supabase settings in assets/supabase-config.js to enable the subscriber table.",
  loginRequired: "Owner login required",
  notAuthorized: "This account does not have owner access.",
  signedIn: "Owner session active",
  loading: "Loading newsletter subscribers...",
  noRows: "No newsletter subscribers were returned.",
  homepagePending: "Homepage newsletter sign-up source is not connected yet.",
  accountSignupPending: "Run the updated portal role setup SQL so future account signups are mirrored into the newsletter subscriber source."
};

function setSessionStatus(message, icon = "lock") {
  if (!els.sessionStatus) return;
  els.sessionStatus.innerHTML = `<span class="material-symbols-outlined">${icon}</span>${escapeHtml(message)}`;
}

function setPanelStatus(message, visible = true) {
  if (!els.status) return;
  els.status.textContent = message;
  els.status.classList.toggle("is-visible", visible && Boolean(message));
}

function showGate(message) {
  els.gate?.classList.add("is-visible");
  if (els.content) els.content.hidden = true;
  setSessionStatus(message);
}

function showContent(user) {
  els.gate?.classList.remove("is-visible");
  if (els.content) els.content.hidden = false;
  if (els.email) els.email.textContent = user.email || "";
  setSessionStatus(t.signedIn, "verified_user");
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

function normalizeNewsletterSignup(row) {
  const sourceValue = String(pickField(row, ["source"], "")).toLowerCase();
  const isAccountSignup = sourceValue.includes("portal_account") || sourceValue.includes("account");
  return {
    source: isAccountSignup ? "Account signup" : "Newsletter sign-up",
    name: pickField(row, ["display_name", "full_name", "name"]),
    email: pickField(row, ["email", "email_address"]),
    companyPhone: [pickField(row, ["company_name", "company"]), pickField(row, ["phone"])].filter(Boolean).join(" / "),
    origin: pickField(row, ["page", "origin"], isAccountSignup ? "Client portal account" : "Homepage newsletter"),
    roleStatus: pickField(row, ["status"], "Newsletter subscriber"),
    created: pickField(row, ["created_at", "submitted_at"]),
    lastActivity: pickField(row, ["updated_at", "last_activity_at"]),
    priority: 1
  };
}

function pendingNewsletterSignupRow() {
  return {
    source: "Newsletter sign-up",
    name: "Capture source pending",
    email: "",
    companyPhone: "",
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
      companyPhone: preferred.companyPhone || secondary.companyPhone,
      origin: preferred.origin || secondary.origin,
      roleStatus: "Newsletter subscriber",
      created: preferred.created || secondary.created,
      lastActivity: preferred.lastActivity || secondary.lastActivity
    });
  });

  return [...mergedByEmail.values(), ...noEmailRows].sort((a, b) => {
    const aTime = new Date(a.created || a.lastActivity || 0).getTime();
    const bTime = new Date(b.created || b.lastActivity || 0).getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

function renderRows(rows) {
  const subscriberCount = rows.filter((row) => !row.isPlaceholder).length;
  if (els.count) {
    els.count.textContent = `${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`;
  }
  if (!els.table) return;
  if (!rows.length) {
    els.table.innerHTML = `<tr><td colspan="8"><div class="client-admin-empty">${escapeHtml(t.noRows)}</div></td></tr>`;
    return;
  }
  els.table.innerHTML = rows.map((row) => `
    <tr>
      <td><span class="client-pill">${escapeHtml(row.source)}</span></td>
      <td><strong>${escapeHtml(row.name || "Unknown")}</strong></td>
      <td>${escapeHtml(row.email || "")}</td>
      <td>${escapeHtml(row.companyPhone || "")}</td>
      <td>${escapeHtml(row.origin || "")}</td>
      <td>${escapeHtml(row.roleStatus || "")}</td>
      <td>${escapeHtml(formatDateTime(row.created))}</td>
      <td>${escapeHtml(formatDateTime(row.lastActivity))}</td>
    </tr>
  `).join("");
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
  if (els.load) els.load.disabled = true;
  setPanelStatus(t.loading);
  try {
    const newsletterResult = await loadNewsletterSignups(supabase);
    const rows = mergeSubscriberRows(newsletterResult.rows);
    const statusMessages = [];
    if (!newsletterResult.connected) {
      rows.push(pendingNewsletterSignupRow());
      statusMessages.push(t.homepagePending);
      statusMessages.push(t.accountSignupPending);
    }
    renderRows(rows);
    setPanelStatus(statusMessages.join(" "), statusMessages.length > 0);
  } finally {
    if (els.load) els.load.disabled = false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT_REF")) {
  showGate(t.setupPending);
} else {
  const supabase = createClient(config.url, config.anonKey);
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
      await loadSubscribers(supabase);
      els.load?.addEventListener("click", async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          showGate(t.loginRequired);
          return;
        }
        const currentRole = await resolveProfilePortalRole(supabase, sessionData.session.user, config);
        if (!isSuperAdminUser(sessionData.session.user, config, currentRole)) {
          showGate(t.notAuthorized);
          return;
        }
        await loadSubscribers(supabase);
      });
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
