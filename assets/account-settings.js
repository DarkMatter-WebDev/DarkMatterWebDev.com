import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { canOpenSeanAdsPortal, isSuperAdminUser, resolveProfilePortalRole } from "./portal-auth.js";

const config = window.DM_SUPABASE_CONFIG || {};
const copy = window.DM_ACCOUNT_SETTINGS_COPY || {};
const isSpanish = document.documentElement.lang.startsWith("es");
const accountPath = isSpanish ? "/es/account.html" : "/account.html";

const t = {
  setupPending: copy.setupPending || (isSpanish ? "Configura Supabase en assets/supabase-config.js para habilitar ajustes." : "Add Supabase settings in assets/supabase-config.js to enable account settings."),
  loginRequired: copy.loginRequired || (isSpanish ? "Inicio de sesión requerido" : "Login required"),
  loginNote: copy.loginNote || (isSpanish ? "Inicia sesión para ver y actualizar los ajustes de tu cuenta." : "Sign in to view and update your account settings."),
  signedIn: copy.signedIn || (isSpanish ? "Sesión activa" : "Signed in"),
  profileSaved: copy.profileSaved || (isSpanish ? "Perfil actualizado." : "Profile updated."),
  passwordSaved: copy.passwordSaved || (isSpanish ? "Contraseña actualizada." : "Password updated."),
  passwordTooShort: copy.passwordTooShort || (isSpanish ? "La contraseña debe tener al menos 6 caracteres." : "Password must be at least 6 characters."),
  passwordMismatch: copy.passwordMismatch || (isSpanish ? "Las contraseñas no coinciden." : "Passwords do not match."),
  passwordRequired: copy.passwordRequired || (isSpanish ? "Escribe una contraseña nueva." : "Enter a new password."),
  nameRequired: copy.nameRequired || (isSpanish ? "Escribe tu nombre." : "Enter your name."),
  error: copy.error || (isSpanish ? "Algo salió mal. Intenta de nuevo." : "Something went wrong. Please try again."),
  profilePartial: copy.profilePartial || (isSpanish ? "Datos básicos guardados. Algunos campos del perfil aún no están conectados en Supabase." : "Basic account details saved. Some profile fields are not writable in Supabase yet.")
};

const els = {
  gate: document.querySelector("[data-settings-gate]"),
  content: document.querySelector("[data-settings-content]"),
  loginLink: document.querySelector("[data-settings-login-link]"),
  accountEmail: document.querySelector("[data-settings-email]"),
  sessionStatus: document.querySelector("[data-settings-session-status]"),
  signOut: document.querySelector("[data-settings-signout]"),
  profileForm: document.querySelector("[data-profile-form]"),
  profileStatus: document.querySelector("[data-profile-status]"),
  profileName: document.querySelector("[data-profile-name]"),
  profilePhone: document.querySelector("[data-profile-phone]"),
  profileCompany: document.querySelector("[data-profile-company]"),
  profileWebsite: document.querySelector("[data-profile-website]"),
  profileEmail: document.querySelector("[data-profile-email]"),
  passwordForm: document.querySelector("[data-password-form]"),
  passwordStatus: document.querySelector("[data-password-status]"),
  passwordNew: document.querySelector("[data-password-new]"),
  passwordConfirm: document.querySelector("[data-password-confirm]"),
  seanPanel: document.querySelector("[data-settings-sean-panel]"),
  adminPanel: document.querySelector("[data-settings-admin-panel]")
};

const nextPath = `${location.pathname}${location.search}${location.hash}`;
const loginUrl = new URL(accountPath, location.origin);
loginUrl.searchParams.set("next", nextPath);
if (els.loginLink) els.loginLink.href = loginUrl.href;

function setPanelStatus(el, message, visible = true) {
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-visible", visible && Boolean(message));
}

function showGate(message) {
  els.gate?.classList.add("is-visible");
  if (els.content) els.content.hidden = true;
  if (els.sessionStatus) {
    els.sessionStatus.innerHTML = `<span class="material-symbols-outlined">lock</span>${message}`;
  }
}

function showContent(user, profileRole = "") {
  els.gate?.classList.remove("is-visible");
  if (els.content) els.content.hidden = false;
  if (els.accountEmail) els.accountEmail.textContent = user.email || "";
  if (els.profileEmail) els.profileEmail.value = user.email || "";
  if (els.sessionStatus) {
    els.sessionStatus.innerHTML = `<span class="material-symbols-outlined">verified_user</span>${t.signedIn}`;
  }

  const isSuperAdmin = isSuperAdminUser(user, config, profileRole);
  const canAccessSean = canOpenSeanAdsPortal(user, config, profileRole);
  if (els.seanPanel) els.seanPanel.hidden = !canAccessSean;
  if (els.adminPanel) els.adminPanel.hidden = !isSuperAdmin;
}

async function loadProfile(supabase, user) {
  const metadata = user.user_metadata || {};
  if (els.profileName) els.profileName.value = metadata.display_name || "";
  if (els.profilePhone) els.profilePhone.value = metadata.phone || "";

  const table = config.tables?.profile || "client_profiles";
  try {
    const { data, error } = await supabase.from(table).select("*").eq("user_id", user.id).maybeSingle();
    if (error || !data) return;
    if (els.profileName && !els.profileName.value) els.profileName.value = data.display_name || "";
    if (els.profilePhone && !els.profilePhone.value) els.profilePhone.value = data.phone || "";
    if (els.profileCompany) els.profileCompany.value = data.company_name || "";
    if (els.profileWebsite) els.profileWebsite.value = data.website || "";
  } catch {
    // Profile table may not exist yet.
  }
}

async function saveProfile(supabase, user) {
  const displayName = els.profileName?.value.trim() || "";
  const phone = els.profilePhone?.value.trim() || "";
  const companyName = els.profileCompany?.value.trim() || "";
  const website = els.profileWebsite?.value.trim() || "";

  if (!displayName) {
    setPanelStatus(els.profileStatus, t.nameRequired);
    return;
  }

  setPanelStatus(els.profileStatus, "", false);

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName, phone }
  });
  if (authError) {
    setPanelStatus(els.profileStatus, authError.message || t.error);
    return;
  }

  let profileSaved = true;
  const table = config.tables?.profile || "client_profiles";
  try {
    const { error: profileError } = await supabase.from(table).upsert(
      {
        user_id: user.id,
        display_name: displayName,
        phone,
        company_name: companyName || null,
        website: website || null
      },
      { onConflict: "user_id" }
    );
    if (profileError) profileSaved = false;
  } catch {
    profileSaved = false;
  }

  setPanelStatus(els.profileStatus, profileSaved ? t.profileSaved : t.profilePartial);
}

async function savePassword(supabase) {
  const password = els.passwordNew?.value || "";
  const confirm = els.passwordConfirm?.value || "";

  if (!password) {
    setPanelStatus(els.passwordStatus, t.passwordRequired);
    return;
  }
  if (password.length < 6) {
    setPanelStatus(els.passwordStatus, t.passwordTooShort);
    return;
  }
  if (password !== confirm) {
    setPanelStatus(els.passwordStatus, t.passwordMismatch);
    return;
  }

  setPanelStatus(els.passwordStatus, "", false);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    setPanelStatus(els.passwordStatus, error.message || t.error);
    return;
  }

  if (els.passwordForm) els.passwordForm.reset();
  setPanelStatus(els.passwordStatus, t.passwordSaved);
}

if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT_REF")) {
  showGate(t.setupPending);
} else {
  const supabase = createClient(config.url, config.anonKey);
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    showGate(t.loginRequired);
  } else {
    const profileRole = await resolveProfilePortalRole(supabase, data.session.user, config);
    showContent(data.session.user, profileRole);
    await loadProfile(supabase, data.session.user);

    els.profileForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        showGate(t.loginRequired);
        return;
      }
      await saveProfile(supabase, sessionData.session.user);
    });

    els.passwordForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        showGate(t.loginRequired);
        return;
      }
      await savePassword(supabase);
    });

    els.signOut?.addEventListener("click", async () => {
      await supabase.auth.signOut();
      showGate(t.loginRequired);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) showGate(t.loginRequired);
    });
  }
}
