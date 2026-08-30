// Netlify Forms only. Supabase was removed 2026-08-30 — with no admin UI left
// to read submissions in-site (the client portal is gone), routing through
// Supabase just added a CDN import and an extra network hop for no benefit.
// Netlify already has its own dashboard and email notifications built in,
// and file attachments ride along for free via FormData(form) — no separate
// storage upload step needed.
const MAX_FILES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const copy = {
  sending: "Sending...",
  sent: "Message sent. We'll be in touch soon.",
  error: "Could not send right now. Please call or text (239) 404-8505.",
  fileType: "Please upload image files only.",
  fileCount: `Please attach ${MAX_FILES} photos or fewer.`,
  fileSize: "Each photo must be 8 MB or smaller."
};

function ensureStatus(form) {
  let status = form.querySelector("[data-site-message-status]");
  if (status) return status;
  status = form.querySelector(".form-submit-error");
  if (status) {
    status.dataset.siteMessageStatus = "";
    return status;
  }
  status = document.createElement("p");
  status.dataset.siteMessageStatus = "";
  status.className = "form-submit-error hidden text-red-400 text-xs font-label-mono";
  const submit = form.querySelector('button[type="submit"]');
  submit?.insertAdjacentElement("beforebegin", status);
  return status;
}

function setStatus(form, message, isError = false) {
  const status = ensureStatus(form);
  status.textContent = message;
  status.classList.toggle("hidden", !message);
  status.classList.toggle("text-red-400", isError);
  status.classList.toggle("text-green-400", !isError && Boolean(message));
}

function setBusy(form, isBusy) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
  button.disabled = isBusy;
  button.classList.toggle("opacity-50", isBusy);
  button.classList.toggle("pointer-events-none", isBusy);
  if (isBusy) {
    button.innerHTML = `<span class="relative z-10 flex items-center justify-center gap-3"><span class="material-symbols-outlined animate-spin">refresh</span>${copy.sending}</span>`;
  } else {
    button.innerHTML = button.dataset.originalHtml;
  }
}

function collectFiles(form) {
  return Array.from(form.querySelectorAll('input[type="file"]')).flatMap((input) => Array.from(input.files || []));
}

function validateFiles(files) {
  if (files.length > MAX_FILES) throw new Error(copy.fileCount);
  for (const file of files) {
    if (!file.type.startsWith("image/")) throw new Error(copy.fileType);
    if (file.size > MAX_FILE_SIZE) throw new Error(copy.fileSize);
  }
}

async function submitForm(form) {
  if (!form.reportValidity()) return;
  const botField = form.elements["bot-field"];
  if (botField && String(botField.value || "").trim()) return;

  validateFiles(collectFiles(form));

  const formName = form.getAttribute("name") || "site-message";
  const data = new FormData(form);
  data.set("form-name", formName);

  const response = await fetch("/", { method: "POST", body: data });
  if (!response.ok) throw new Error(`Netlify form submission failed with ${response.status}`);
}

function bindSiteMessageForms() {
  document.querySelectorAll("[data-site-message-form]").forEach((form) => {
    if (form.dataset.siteMessageBound === "true") return;
    form.dataset.siteMessageBound = "true";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(form, "");
      setBusy(form, true);
      try {
        await submitForm(form);
        form.reset();
        setStatus(form, copy.sent, false);
      } catch (error) {
        setStatus(form, error?.message || copy.error, true);
      } finally {
        setBusy(form, false);
      }
    });
  });
}

bindSiteMessageForms();
document.addEventListener("DOMContentLoaded", bindSiteMessageForms);
