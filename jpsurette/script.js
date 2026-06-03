const cursor = document.querySelector("[data-cursor]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const form = document.querySelector("[data-contact-form]");
const hero = document.querySelector(".hero");
const heroMark = document.querySelector(".hero-mark");
const heroImages = document.querySelectorAll(".hero-panel img");
const heroContents = document.querySelectorAll(".hero-content");

if (cursor) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  document.querySelectorAll("a, button, input, textarea, select, .work-card").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.toggleAttribute("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("hidden", "");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (hero && heroMark && heroImages.length) {
  let ticking = false;

  const updateHeroParallax = () => {
    const rect = hero.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = Math.min(1, Math.max(0, -rect.top / viewport));

    heroMark.style.setProperty("--mark-parallax", `${progress * -150}px`);
    heroImages.forEach((image, index) => {
      const direction = index === 0 ? 1 : -1;
      image.style.setProperty("--img-parallax", `${progress * direction * 62}px`);
    });
    heroContents.forEach((content, index) => {
      const direction = index === 0 ? -1 : -0.82;
      content.style.setProperty("--content-parallax", `${progress * direction * 92}px`);
    });

    ticking = false;
  };

  const requestHeroParallax = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeroParallax);
  };

  updateHeroParallax();
  window.addEventListener("scroll", requestHeroParallax, { passive: true });
  window.addEventListener("resize", requestHeroParallax);
}

if (form) {
  form.addEventListener("submit", () => {
    const button = form.querySelector("button[type='submit']");
    if (!button) return;
    button.dataset.originalText = button.textContent;
    button.textContent = "Sending";
    button.disabled = true;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
