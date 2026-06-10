import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { canOpenSeanAdsPortal, getSeanDashboardAccess, resolveProfilePortalRole } from "./portal-auth.js";

const copy = window.DM_SEANS_ADS_DASHBOARD_COPY || {};
const config = window.DM_SUPABASE_CONFIG || {};
const isSpanish = document.documentElement.lang.startsWith("es");
const accountPath = isSpanish ? "/es/account.html" : "/account.html";

const t = {
  setupPending: copy.setupPending || (isSpanish ? "Configuración del portal pendiente" : "Portal login setup pending"),
  loginRequired: copy.loginRequired || (isSpanish ? "Inicio de sesión requerido" : "Login required"),
  accessDenied: copy.accessDenied || (isSpanish ? "Solo Sean" : "Sean access only"),
  accessDeniedNote:
    copy.accessDeniedNote ||
    (isSpanish
      ? "Este centro de clientes de Google Ads esta restringido a Sean y a la cuenta propietaria de Dark Matter."
      : "This Google Ads customer center is restricted to Sean and the Dark Matter owner account."),
  authorized: copy.authorized || (isSpanish ? "Autorizado" : "Authorized"),
  ownerOversight: copy.ownerOversight || (isSpanish ? "Supervisión del propietario" : "Owner oversight"),
  accountLabel: copy.accountLabel || (isSpanish ? "Cuenta" : "Account")
};

const nextPath = `${location.pathname}${location.search}${location.hash}`;
const loginUrl = new URL(accountPath, location.origin);
loginUrl.searchParams.set("next", nextPath);

const loginLink = document.querySelector("[data-login-link]");
if (loginLink) loginLink.href = loginUrl.href;

const status = document.querySelector("[data-session-status]");
const gate = document.querySelector("[data-ads-gate]");
const privatePanel = document.querySelector("[data-ads-private]");
const ownerTools = document.querySelector("[data-ads-owner-tools]");
const addProjectButton = document.querySelector("[data-ads-project-add]");
const projectForm = document.querySelector("[data-ads-project-form]");
const closeProjectButton = document.querySelector("[data-ads-project-close]");
const navAccountLabel = document.querySelector("[data-nav-account-label]");

function showGate(message, noteText) {
  if (status) status.innerHTML = message;
  gate?.classList.add("is-visible");
  const note = gate?.querySelector(".ads-note");
  if (note && noteText) note.textContent = noteText;
}

function applyAuthorizedSession(user, profileRole = "") {
  if (navAccountLabel) navAccountLabel.textContent = t.accountLabel;

  const access = getSeanDashboardAccess(user, config, profileRole);
  if (status) {
    status.innerHTML = access.isSuperAdmin
      ? `<span class="material-symbols-outlined">verified_user</span>${t.ownerOversight}`
      : `<span class="material-symbols-outlined">verified_user</span>${t.authorized}`;
    status.classList.toggle("is-admin", access.isSuperAdmin);
  }

  if (ownerTools) ownerTools.hidden = !access.showOwnerTools;
  if (privatePanel) privatePanel.hidden = !access.showClientWorkspace;
}

if (!config.url || !config.anonKey) {
  if (status) status.textContent = t.setupPending;
  gate?.classList.add("is-visible");
} else {
  const supabase = createClient(config.url, config.anonKey);
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    try { localStorage.removeItem("dm_logged_in"); } catch (e) {}
    showGate(`<span class="material-symbols-outlined">lock</span>${t.loginRequired}`);
  } else {
    try { localStorage.setItem("dm_logged_in", "1"); } catch (e) {}
    const profileRole = await resolveProfilePortalRole(supabase, data.session.user, config);
    if (!canOpenSeanAdsPortal(data.session.user, config, profileRole)) {
      showGate(
        `<span class="material-symbols-outlined">lock</span>${t.accessDenied}`,
        t.accessDeniedNote
      );
    } else {
      applyAuthorizedSession(data.session.user, profileRole);
    }
  }
}

addProjectButton?.addEventListener("click", () => {
  if (!projectForm) return;
  projectForm.hidden = false;
  projectForm.scrollIntoView({ behavior: "smooth", block: "center" });
});

closeProjectButton?.addEventListener("click", () => {
  if (projectForm) projectForm.hidden = true;
});
