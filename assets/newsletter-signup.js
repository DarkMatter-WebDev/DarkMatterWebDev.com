import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.DM_SUPABASE_CONFIG || {};
const forms = Array.from(document.querySelectorAll("[data-newsletter-form]"));

const messages = {
  setup: "Newsletter signup is not connected yet.",
  invalid: "Enter a valid email address.",
  loading: "Adding you to the list...",
  success: "You're subscribed. Thank you.",
  duplicate: "You're already on the subscriber list.",
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

function buildPayload(form, email) {
  const page = `${location.pathname}${location.search}${location.hash}` || "/";
  return {
    email,
    source: "homepage_newsletter",
    page,
    origin: form.dataset.newsletterOrigin || "homepage",
    status: "Newsletter subscriber",
    submitted_at: new Date().toISOString()
  };
}

if (!forms.length) {
  // No-op on pages without the newsletter form.
} else if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT_REF")) {
  forms.forEach((form) => {
    setStatus(form, messages.setup, "error");
    form.querySelector("button")?.setAttribute("disabled", "disabled");
  });
} else {
  const supabase = createClient(config.url, config.anonKey);
  const table = config.tables?.homepageEmailSignups || "homepage_email_signups";

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
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
        const { error } = await supabase.from(table).insert(buildPayload(form, email));
        if (error) throw error;
        setStatus(form, messages.success, "success");
        form.reset();
      } catch (error) {
        if (error?.code === "23505" || /duplicate|unique/i.test(error?.message || "")) {
          setStatus(form, messages.duplicate, "success");
          form.reset();
        } else {
          setStatus(form, messages.error, "error");
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}
