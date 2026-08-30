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
  var TEL = "tel:+12394048505";
  var TAGLINE_PARTS = ["Software", "Websites", "Business Tech", "Southwest Florida"];
  var TAGLINE = TAGLINE_PARTS.join(" &middot; ");

  // Legal/meta text is built from atomic phrases rather than one string. A plain
  // string can break at any space, which is how "Call or text (239) 404-8505"
  // ended up splitting the number across two lines ("404-" / "8505"). Each
  // phrase is nowrap in CSS, so a tight column wraps *between* phrases and never
  // inside one. Separators are their own elements so they can dim, and are
  // aria-hidden so a screen reader hears the phrases, not the dots.
  function phrases(parts) {
    return parts
      .map(function (part) {
        return "<span>" + part + "</span>";
      })
      .join('<span class="dm-legal-sep" aria-hidden="true">&middot;</span>');
  }

  // Wide screens list every destination; the phone footer drops the two that
  // the bottom tab bar already covers and shortens the rest to fit one row.
  var wideLinks = [
    ["Website Design / Hosting", "services/website-design-hosting.html"],
    ["Custom Business Web Apps", "apps.html"],
    ["In-Home Tech Services", "services/in-home-services.html"],
    ["Portfolio", "portfolio.html"],
    ["Contact", "contact.html"],
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
          '<span class="dm-footer__tagline">' + phrases(TAGLINE_PARTS) + "</span>" +
        "</div>" +
        '<nav class="dm-footer__links" aria-label="Footer">' + links(wideLinks) + "</nav>" +
        // Three short lines rather than two long ones. "Southwest Florida" used
        // to ride the copyright line behind a "·", which made that line 282px —
        // the widest thing in the column by far. On its own line the column is
        // only as wide as the phone line (~162px), so the block reads as a tidy
        // stack instead of one long run, and hands ~120px back to the brand.
        '<div class="dm-footer__legal">' +
          '<div class="dm-footer__legal-line">' +
            "<span>&copy; " + YEAR + " Surette Data Systems</span>" +
          "</div>" +
          '<div class="dm-footer__legal-line">' +
            "<span>Call or text</span>" +
            '<a href="' + TEL + '">' + PHONE + "</a>" +
          "</div>" +
          '<div class="dm-footer__legal-line">' +
            "<span>Southwest Florida</span>" +
          "</div>" +
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
      // Phrase-atomic like the wide footer, so this centred line breaks between
      // phrases instead of mid-phrase ("Business" / "Tech"). No phone here — the
      // phone footer mirrors the homepage's, which does not carry one.
      '<p class="dm-footer-mobile__legal">' +
        phrases(["&copy; " + YEAR + " Surette Data Systems"].concat(TAGLINE_PARTS)) +
      "</p>" +
    "</footer>";

  var html = variant === "desktop" ? wide : variant === "mobile" ? phone : wide + phone;

  script.insertAdjacentHTML("afterend", html);
  script.dataset.dmFooterReady = "true";
  document.body.classList.add("has-dm-standard-footer");
})();
