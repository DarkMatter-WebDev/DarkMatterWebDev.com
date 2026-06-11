/* account-nav.js
   Reflects the signed-in state in the top-nav account link on every page.
   When the user is logged in, the "Client Login" / "Acceso" link becomes
   "Account" / "Cuenta"; when logged out it is restored to its original label.
   Re-runs on bfcache restore (pageshow) and on cross-tab login/logout (storage),
   so the button stays correct on back/forward navigation and in other tabs.

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
    var label = isEs ? "Cuenta" : "Account";
    // Match the account link regardless of URL style: "account.html",
    // "/account.html", "../account.html", the clean URL "/account" or "account",
    // and any of those with a ?query or #hash. Deliberately does NOT match
    // "account-settings", "account-created", "account-ads-status", etc.
    var accountHref = /(^|\/)account(\.html)?([?#]|$)/i;
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!accountHref.test(a.getAttribute("href") || "")) continue;
      var iconEl = a.querySelector(".material-symbols-outlined");
      if (!iconEl) continue; // only the nav account button carries the icon
      var name = (iconEl.textContent || "").trim();
      if (name !== "account_circle" && name !== "login") continue;
      // Remember the page's original (logged-out) button markup exactly once, so
      // signing out restores it verbatim instead of leaving a stale "Account".
      if (!a.hasAttribute("data-dm-orig")) a.setAttribute("data-dm-orig", a.innerHTML);
      if (signedIn) {
        iconEl.textContent = "account_circle";
        a.textContent = "";
        a.appendChild(iconEl);
        a.appendChild(document.createTextNode(label));
      } else {
        // Put the original "Client Login" / "Acceso" button back.
        a.innerHTML = a.getAttribute("data-dm-orig");
      }
    }
  }

  // ── Mobile header: inject account icon + shrink lang toggle ──────────────
  function injectMobileAccountIcon() {
    var mobileSection = document.querySelector('.md\\:hidden');
    if (!mobileSection) return;
    var langSwitch = mobileSection.querySelector('.lang-switch');
    if (!langSwitch) return;
    if (langSwitch.querySelector('.dm-mob-acct')) return; // already injected

    // Shrink the EN/ES labels
    langSwitch.style.fontSize = '10px';
    langSwitch.style.gap = '5px';

    // Resolve account.html relative to the current page depth
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    var depth = Math.max(0, parts.length - 1);
    var prefix = depth > 0 ? Array(depth).fill('..').join('/') + '/' : '';
    var isEs = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
    var href = prefix + (isEs ? 'es/' : '') + 'account.html';
    var onAcct = /(^|\/)account(\.html)?([?#]|$)/i.test(path);

    var a = document.createElement('a');
    a.href = href;
    a.className = 'dm-mob-acct';
    a.setAttribute('aria-label', isEs ? 'Acceso de cliente' : 'Client login');
    a.style.cssText = [
      'display:flex', 'align-items:center', 'text-decoration:none',
      'transition:color 0.2s',
      'color:' + (onAcct ? '#00F0FF' : 'rgba(196,199,199,0.55)'),
      'margin-right:4px',
      'padding-right:6px',
      'border-right:1px solid rgba(255,255,255,0.12)'
    ].join(';');
    a.addEventListener('mouseenter', function () { this.style.color = '#00F0FF'; });
    a.addEventListener('mouseleave', function () {
      if (!onAcct) this.style.color = 'rgba(196,199,199,0.55)';
    });

    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.style.cssText = 'font-size:18px;line-height:1;';
    icon.textContent = 'account_circle';
    a.appendChild(icon);

    langSwitch.insertBefore(a, langSwitch.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(); injectMobileAccountIcon(); }, { once: true });
  } else {
    apply();
    injectMobileAccountIcon();
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
