export const PORTAL_ROLES = {
  SUPER_ADMIN: "super_admin",
  SEAN_ADS_ADMIN: "sean_ads_admin"
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getConfig(config) {
  return config || window.DM_SUPABASE_CONFIG || {};
}

export function getUserPortalRole(user, profileRole = "") {
  const role = String(
    user?.app_metadata?.portal_role ||
    user?.app_metadata?.role ||
    profileRole ||
    ""
  ).trim().toLowerCase();

  if (role === PORTAL_ROLES.SUPER_ADMIN || role === PORTAL_ROLES.SEAN_ADS_ADMIN) {
    return role;
  }
  return "";
}

function emailInList(email, list) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return (list || []).map(normalizeEmail).filter(Boolean).includes(normalized);
}

export function isSuperAdminUser(user, config, profileRole = "") {
  if (getUserPortalRole(user, profileRole) === PORTAL_ROLES.SUPER_ADMIN) return true;
  return emailInList(user?.email, getConfig(config).superAdminEmails);
}

export function isSeanAdsAdminUser(user, config, profileRole = "") {
  if (getUserPortalRole(user, profileRole) === PORTAL_ROLES.SEAN_ADS_ADMIN) return true;
  return emailInList(user?.email, getConfig(config).seanGoogleAdsAdminEmails);
}

export function canOpenSeanAdsPortal(user, config, profileRole = "") {
  return isSuperAdminUser(user, config, profileRole) || isSeanAdsAdminUser(user, config, profileRole);
}

export function getSeanDashboardAccess(user, config, profileRole = "") {
  const isSuperAdmin = isSuperAdminUser(user, config, profileRole);
  const isSeanAdsAdmin = isSeanAdsAdminUser(user, config, profileRole);

  return {
    canAccess: isSuperAdmin || isSeanAdsAdmin,
    isSuperAdmin,
    isSeanAdsAdmin,
    showOwnerTools: isSuperAdmin || isSeanAdsAdmin,
    showClientWorkspace: isSuperAdmin
  };
}

export async function resolveProfilePortalRole(supabase, user, config) {
  const table = getConfig(config).tables?.profile || "client_profiles";
  let profileRole = "";

  try {
    const { data, error } = await supabase
      .from(table)
      .select("portal_role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error && data?.portal_role) profileRole = String(data.portal_role);
  } catch {
    // Profile table may not be reachable yet for this user.
  }

  if (!profileRole) {
    try {
      const { data, error } = await supabase.rpc("get_portal_role");
      if (!error && data) profileRole = String(data);
    } catch {
      // RPC may not exist in older projects.
    }
  }

  return profileRole.trim().toLowerCase();
}
