// Public Supabase client settings for the Surette Data Systems client portal.
// Dedicated Supabase project for the Surette Data Systems portal.
// This portal is no longer shared with the Naples Estate Jewelry project.
// Never put Supabase service-role keys or Stripe secret keys in this file.
//
// Live portal tables:
//   client_profiles, client_services, client_invoices, client_documents,
//   client_messages, homepage_email_signups
//
// Privileged portal access resolves in this order:
// 1. auth.users app_metadata.portal_role (or legacy app_metadata.role)
// 2. client_profiles.portal_role for the signed-in user
// 3. Email allowlists below (UI fallback only - no admin emails hardcoded here)
window.DM_SUPABASE_CONFIG = {
  url: "https://axlszyssxyvehjatztwe.supabase.co",
  anonKey: "sb_publishable_qKXSXbrUR-sW0tJ1ul3upw__X8IBqh9",
  siteUrl: "https://surettesystems.com",
  portalRoles: {
    superAdmin: "super_admin",
    seanAdsAdmin: "sean_ads_admin"
  },
  tables: {
    profile: "client_profiles",
    services: "client_services",
    invoices: "client_invoices",
    documents: "client_documents",
    messages: "client_messages",
    homepageEmailSignups: "homepage_email_signups"
  },
  // Admin role resolved from Supabase app_metadata.role - no emails hardcoded here
  superAdminEmails: [],
  seanGoogleAdsAdminEmails: [
    "scochrane495@gmail.com"
  ]
};
