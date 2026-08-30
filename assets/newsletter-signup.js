// Netlify Forms only. Supabase was removed 2026-08-30 — with no admin UI left
// to read the subscriber list in-site (the client portal is gone), Netlify's
// own Forms dashboard is now the only place signups are visible, so there is
// no reason to also write them into a database nobody can browse.
const forms = Array.from(document.querySelectorAll("[data-newsletter-form]"));

const messages = {
  invalid: "Enter a valid email address.",
  loading: "Adding you to the list...",
  success: "You're subscribed. Thank you.",
  error: "We could not save that email. Please try again."
};

function setStatus(form, message, type = "") {
  const status = form.querySelector("[data-newsletter-status]");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-success", type === "success");
  status.classList.toggle("is-error", type === "error");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const botField = form.elements["bot-field"];
    if (botField && String(botField.value || "").trim()) return;

    const emailInput = form.querySelector('input[name="email"]');
    const button = form.querySelector("button");
    const email = normalizeEmail(emailInput?.value);

    if (!isValidEmail(email)) {
      setStatus(form, messages.invalid, "error");
      emailInput?.focus();
      return;
    }

    setStatus(form, messages.loading);
    if (button) button.disabled = true;

    try {
      const data = new FormData(form);
      data.set("email", email);
      data.set("form-name", form.getAttribute("name") || "newsletter");
      const response = await fetch("/", { method: "POST", body: data });
      if (!response.ok) throw new Error(`Netlify form submission failed with ${response.status}`);
      setStatus(form, messages.success, "success");
      form.reset();
    } catch (error) {
      setStatus(form, messages.error, "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
});
