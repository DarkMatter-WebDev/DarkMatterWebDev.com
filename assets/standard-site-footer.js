/* standard-site-footer.js
   The one site footer. Every page injects it from here instead of keeping its
   own copy — the site had drifted to roughly ten different footers (compact
   ones, centered ones, `.app-footer`, `.service-mobile-footer`, a couple of
   bespoke one-offs), each with its own link set, so a change to "the footer"
   only ever reached the page it was made on.

   Mirrors the homepage exactly, which means two variants rather than one
   responsive layout: the wide footer (>=768px, so tablet gets it too) carries
   the full link list and a tagline, while the phone footer is centred, uses
   short labels, and adds the brand mark. Both are emitted together and gated by
   CSS, so a page normally needs a single tag.

   data-variant="desktop" | "mobile" | (omitted = both)
     Pages built as two parallel layouts keep one wrapper for wide screens and
     one for phones. They need the matching variant inside each wrapper, since a
     footer injected into the hidden wrapper would be hidden along with it.

   Paths are relative to the repo root and get a ../ under services/, the same
   convention standard-site-nav.js uses.

   Styling lives in assets/nav.css (.dm-footer*), deliberately as plain CSS: the
   Tailwind CDN only builds the utilities it can find in a page's static HTML,
   and once these footers are injected the classes appear nowhere else — tested
   that way, `text-on-primary-container/60` silently rendered white. */
(function () {
  var script = document.currentScript;
  if (!script || script.dataset.dmFooterReady === "true") return;

  var variant = (script.dataset.variant || "both").toLowerCase();
  var root = window.location.pathname.replace(/\\/g, "/").indexOf("/services/") !== -1 ? "../" : "";

  function u(href) {
    return root + href;
  }

  var YEAR = "2026";
  var PHONE = "(239) 404-8505";
  var TAGLINE = "Software &middot; Websites &middot; Business Tech &middot; Southwest Florida";

  // Wide screens list every destination; the phone footer drops the two that
  // the bottom tab bar already covers and shortens the rest to fit one row.
  var wideLinks = [
    ["Website Design / Hosting", "services/website-design-hosting.html"],
    ["Custom Business Web Apps", "apps.html"],
    ["In-Home Tech Services", "services/in-home-services.html"],
    ["Portfolio", "portfolio.html"],
    ["Contact", "contact.html"],
    ["Client Login", "account.html"],
    ["Privacy", "privacy.html"],
    ["Terms", "terms.html"],
    ["Accessibility", "accessibility.html"]
  ];

  var phoneLinks = [
    ["Design/Hosting", "services/website-design-hosting.html"],
    ["Web Apps", "apps.html"],
    ["Portfolio", "portfolio.html"],
    ["Contact", "contact.html"],
    ["Privacy", "privacy.html"],
    ["Terms", "terms.html"],
    ["Accessibility", "accessibility.html"]
  ];

  function links(items) {
    return items
      .map(function (item) {
        return '<a href="' + u(item[1]) + '">' + item[0] + "</a>";
      })
      .join("");
  }

  var wide =
    '<footer class="dm-footer">' +
      '<div class="dm-footer__inner">' +
        '<div class="dm-footer__brand">' +
          '<span class="dm-footer__wordmark">SURETTE DATA SYSTEMS</span>' +
          '<span class="dm-footer__tagline">' + TAGLINE + "</span>" +
        "</div>" +
        '<nav class="dm-footer__links" aria-label="Footer">' + links(wideLinks) + "</nav>" +
        '<div class="dm-footer__legal">' +
          "<span>&copy; " + YEAR + " Surette Data Systems &middot; Southwest Florida</span>" +
          "<span>Call or text " + PHONE + "</span>" +
        "</div>" +
      "</div>" +
    "</footer>";

  var phone =
    '<footer class="dm-footer-mobile">' +
      '<div class="dm-footer-mobile__brand">' +
        '<span class="material-symbols-outlined" aria-hidden="true">blur_on</span>' +
        '<span class="dm-footer-mobile__wordmark">SURETTE DATA SYSTEMS</span>' +
      "</div>" +
      '<nav class="dm-footer-mobile__links" aria-label="Footer">' + links(phoneLinks) + "</nav>" +
      '<p class="dm-footer-mobile__legal">&copy; ' + YEAR + " Surette Data Systems &middot; " + TAGLINE + "</p>" +
    "</footer>";

  var html = variant === "desktop" ? wide : variant === "mobile" ? phone : wide + phone;

  script.insertAdjacentHTML("afterend", html);
  script.dataset.dmFooterReady = "true";
  document.body.classList.add("has-dm-standard-footer");
})();
