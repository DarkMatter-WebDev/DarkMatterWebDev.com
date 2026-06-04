// Public Supabase client settings for the Dark Matter client portal.
// Replace these placeholders after creating the Supabase project.
// Never put Supabase service-role keys or Stripe secret keys in this file.
window.DM_SUPABASE_CONFIG = {
  url: "https://axlszyssxyvehjatztwe.supabase.co",
  anonKey: "sb_publishable_qKXSXbrUR-sW0tJ1ul3upw__X8IBqh9",
  tables: {
    profile: "client_profiles",
    services: "client_services",
    billing: "client_billing",
    websiteStatus: "client_website_status",
    websiteStats: "client_website_stats"
  }
};
