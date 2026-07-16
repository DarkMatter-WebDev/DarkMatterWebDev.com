/* account-nav.js
   Reflects the signed-in state in the top-nav account link on every page.
   When the user is logged in, the "Client Login" link becomes "Account";
   when logged out it is restored to its original label.
   Re-runs on bfcache restore (pageshow) and on cross-tab login/logout (storage),
   so the button stays correct on back/forward navigation and in other tabs.

   Source of truth: the authoritative portal scripts (client-portal.js,
   account-settings.js, seans-ads-dashboard.js) set a simple "dm_logged_in"
   flag in localStorage via supabase.auth.getSession()/onAuthStateChange.
   This script just reads that flag, so it works the same on every page.
   As a fallback it also detects a Supabase auth token directly (matching
   any sb-...-auth-token key, including chunked variants). */
(function () {
  var MOBILE_ACCOUNT_COLORS = {
    signedIn: "#00F0FF",
    signedOut: "rgba(196, 199, 199, 0.55)"
  };

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
    var label = "Account";
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
      // Full-row/full-link "Client Login" nav items (desktop nav link, mobile
      // hamburger menu row) only look highlighted once actually signed in —
      // previously these were hardcoded cyan regardless of session state.
      if (a.classList.contains("dm-account-link-desktop") || a.classList.contains("dm-account-link-mobile")) {
        a.classList.toggle("is-signed-in", signedIn);
      }
      if (signedIn) {
        iconEl.textContent = "account_circle";
        a.textContent = "";
        a.appendChild(iconEl);
        if (a.classList.contains("dm-mob-acct")) {
          a.setAttribute("aria-label", label);
          a.setAttribute("title", label);
          setMobileAccountColor(a, true);
        } else {
          a.appendChild(document.createTextNode(label));
        }
      } else {
        a.innerHTML = a.getAttribute("data-dm-orig");
        if (a.classList.contains("dm-mob-acct")) {
          a.setAttribute("aria-label", "Client login");
          a.setAttribute("title", "Client login");
          setMobileAccountColor(a, false);
        }
      }
    }
  }

  function setMobileAccountColor(link, signedIn) {
    if (!link || !link.classList || !link.classList.contains("dm-mob-acct")) return;
    var color = signedIn ? MOBILE_ACCOUNT_COLORS.signedIn : MOBILE_ACCOUNT_COLORS.signedOut;
    link.dataset.dmSignedIn = signedIn ? "true" : "false";
    link.style.color = color;
    link.style.opacity = signedIn ? "1" : "0.92";
  }

  // ── Mobile header: inject account icon into header flex row ──────────────
  function injectMobileAccountIcon() {
    var mobileSection = document.querySelector('.md\\:hidden');
    if (!mobileSection) return;

    var header = mobileSection.querySelector('header');
    var container;
    if (header) {
      // Some pages put flex classes directly on <header>; others wrap in a child <div>
      if (header.classList.contains('flex') && header.classList.contains('justify-between')) {
        container = header;
      } else {
        container = header.querySelector('.flex.items-center.justify-between') || header;
      }
    } else {
      container = mobileSection.querySelector('.flex.items-center.justify-between');
    }
    var rightControls = container && Array.prototype.slice.call(container.children).find(function (child) {
      return child.classList && child.classList.contains('flex') && child.classList.contains('items-center') && child.classList.contains('gap-3');
    });
    if (rightControls) container = rightControls;
    if (!container) return;
    if (container.querySelector('.dm-mob-acct')) return; // already injected

    // Resolve account.html relative to the current page depth
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    var depth = Math.max(0, parts.length - 1);
    var prefix = depth > 0 ? Array(depth).fill('..').join('/') + '/' : '';
    var href = prefix + 'account.html';
    var signedIn = hasSession();

    var a = document.createElement('a');
    a.href = href;
    a.className = 'dm-mob-acct';
    a.setAttribute('aria-label', 'Client login');
    a.style.cssText = [
      'display:flex', 'align-items:center', 'text-decoration:none',
      'transition:color 0.2s',
      'color:' + (signedIn ? MOBILE_ACCOUNT_COLORS.signedIn : MOBILE_ACCOUNT_COLORS.signedOut)
    ].join(';');
    a.addEventListener('mouseenter', function () {
      setMobileAccountColor(this, this.dataset.dmSignedIn === "true");
    });
    a.addEventListener('mouseleave', function () {
      setMobileAccountColor(this, this.dataset.dmSignedIn === "true");
    });

    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.style.cssText = 'font-size:18px;line-height:1;';
    icon.textContent = 'account_circle';
    a.appendChild(icon);
    setMobileAccountColor(a, signedIn);

    var menuButton = container.querySelector('#mobile-menu-btn');
    var menuControl = menuButton && menuButton.closest('.relative');
    if (menuControl && menuControl.parentElement === container) {
      container.insertBefore(a, menuControl);
    } else {
      container.appendChild(a);
    }
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
