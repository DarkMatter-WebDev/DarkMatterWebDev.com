// Public Supabase client settings for the Dark Matter client portal.
// Shared Supabase project: Estate Jewelry / Naples Estate Jewelry + Dark Matter portal.
// Never put Supabase service-role keys or Stripe secret keys in this file.
//
// Live portal tables (jewelry tables like profiles, favorites, customer_carts stay separate):
//   client_profiles, client_services, client_invoices, client_documents, client_messages
//
// Privileged portal access resolves in this order:
// 1. auth.users app_metadata.portal_role (or legacy app_metadata.role)
// 2. client_profiles.portal_role for the signed-in user
// 3. Email allowlists below (UI fallback only)
window.DM_SUPABASE_CONFIG = {
  url: "https://evzluixourmsefwdsieu.supabase.co",
  anonKey: "sb_publishable_gz00q5m9SdyEAXU3b8Srng_4vBM6dSJ",
  jewelrySiteUrl: "https://naplesestatejewelry.co",
  portalRoles: {
    superAdmin: "super_admin",
    seanAdsAdmin: "sean_ads_admin"
  },
  tables: {
    profile: "client_profiles",
    services: "client_services",
    invoices: "client_invoices",
    documents: "client_documents",
    messages: "client_messages"
  },
  superAdminEmails: [
    "rcman12589@aol.com"
  ],
  seanGoogleAdsAdminEmails: [
    "scochrane495@gmail.com"
  ]
};
