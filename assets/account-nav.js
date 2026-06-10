/* account-nav.js
   Reflects the signed-in state in the top-nav account link on every page.
   When the user is logged in, the "Client Login" / "Acceso" link becomes
   "Account" / "Cuenta" with the account icon.

   Source of truth: the authoritative portal scripts (client-portal.js,
   account-settings.js, seans-ads-dashboard.js) set a simple "dm_logged_in"
   flag in localStorage via supabase.auth.getSession()/onAuthStateChange.
   This script just reads that flag, so it works the same on every page.
   As a fallback it also detects a Supabase auth token directly (matching
   any sb-...-auth-token key, including chunked variants). */
(function () {
  function hasSession() {
    try {
      if (localStorage.getItem("dm_logged_in") === "1") return true;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf("sb-") === 0 && k.indexOf("auth-token") !== -1) {
          var v = localStorage.getItem(k);
          if (v && v.length > 20) {
            try { localStorage.setItem("dm_logged_in", "1"); } catch (e) {}
            return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  function apply() {
    var signedIn = hasSession();
    var isEs = (document.documentElement.lang || "en").toLowerCase().indexOf("es") === 0;
    var label = signedIn ? (isEs ? "Cuenta" : "Account") : (isEs ? "Acceso" : "Client Login");
    var icon = signedIn ? "account_circle" : "login";
    var links = document.querySelectorAll('a[href$="account.html"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var iconEl = a.querySelector(".material-symbols-outlined");
      if (!iconEl) continue; // only the nav account button carries the icon
      var name = (iconEl.textContent || "").trim();
      if (name !== "account_circle" && name !== "login") continue;
      // Only rewrite when logged in; leave the page's own label otherwise so
      // we never clobber a deliberately different label (e.g. "Acceso").
      if (!signedIn) continue;
      iconEl.textContent = icon;
      a.textContent = "";
      a.appendChild(iconEl);
      a.appendChild(document.createTextNode(label));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }

  // Re-apply when the page is shown again, including back/forward navigations
  // restored from the bfcache. Scripts do NOT re-run on a bfcache restore, so
  // without this a page first rendered while logged out keeps showing
  // "Client Login" after the user signs in and navigates back to it.
  window.addEventListener("pageshow", function () { apply(); });

  // Reflect a login that happened in another tab without needing a reload.
  window.addEventListener("storage", function (e) {
    if (!e || e.key == null || e.key === "dm_logged_in" || e.key.indexOf("sb-") === 0) apply();
  });
})();
