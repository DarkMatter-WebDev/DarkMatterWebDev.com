/* account-nav.js
   Reflects the signed-in state in the top-nav account link on every page.
   When a Supabase session is present in localStorage, the "Client Login" /
   "Acceso" link becomes "Account" / "Cuenta" with the account icon.

   Detection is a lightweight localStorage read (no supabase-js load) so it
   works on static marketing pages. The authoritative portal pages keep using
   client-portal.js; this only fills the gap on the rest of the site. */
(function () {
  function hasSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (/^sb-.*-auth-token$/.test(k)) {
          var raw = localStorage.getItem(k);
          if (!raw) continue;
          var obj = JSON.parse(raw);
          var s = obj && obj.currentSession ? obj.currentSession : obj;
          if (s && (s.access_token || s.refresh_token)) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function apply() {
    if (!hasSession()) return;
    var isEs = (document.documentElement.lang || "en").toLowerCase().indexOf("es") === 0;
    var label = isEs ? "Cuenta" : "Account";
    var links = document.querySelectorAll('a[href$="account.html"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var icon = a.querySelector(".material-symbols-outlined");
      if (!icon) continue; // only the nav account button carries the icon
      var name = (icon.textContent || "").trim();
      if (name !== "account_circle" && name !== "login") continue;
      icon.textContent = "account_circle";
      a.textContent = "";
      a.appendChild(icon);
      a.appendChild(document.createTextNode(label));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
