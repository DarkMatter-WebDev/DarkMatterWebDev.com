import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.DM_SUPABASE_CONFIG || {};
const MAX_FILES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ATTACHMENT_BUCKET = "portal-message-attachments";

const copy = {
  setup: "Message center setup is pending. Please call or text (239) 404-8505.",
  sending: "Sending...",
  sent: "Message sent. We'll be in touch soon.",
  error: "Could not send right now. Please call or text (239) 404-8505.",
  fileType: "Please upload image files only.",
  fileCount: `Please attach ${MAX_FILES} photos or fewer.`,
  fileSize: "Each photo must be 8 MB or smaller."
};

const supabase = config.url && config.anonKey && !config.url.includes("YOUR_PROJECT_REF")
  ? createClient(config.url, config.anonKey)
  : null;

function fieldLabel(field) {
  const explicit = field.id ? document.querySelector(`label[for="${CSS.escape(field.id)}"]`) : null;
  const wrapping = field.closest("label");
  const text = explicit?.textContent || wrapping?.textContent || field.name || "Field";
  return text.replace(/\s+/g, " ").replace(/\(optional\)/i, "").trim();
}

function fieldValue(field) {
  if (field.type === "checkbox") return field.checked ? "Yes" : "";
  if (field.type === "radio") return field.checked ? field.value : "";
  if (field.tagName === "SELECT") {
    return field.options[field.selectedIndex]?.text?.trim() || field.value.trim();
  }
  return String(field.value || "").trim();
}

function publicFields(form) {
  return Array.from(form.elements).filter((field) => {
    if (!field.name || field.disabled) return false;
    if (field.type === "hidden" || field.type === "submit" || field.type === "button" || field.type === "file") return false;
    if (field.name === "bot-field" || field.name === "form-name") return false;
    return true;
  });
}

function getNamedValue(form, names) {
  for (const name of names) {
    const field = form.elements[name];
    if (!field) continue;
    const value = fieldValue(field);
    if (value) return value;
  }
  return "";
}

function buildName(form) {
  const direct = getNamedValue(form, ["name", "full_name", "display_name"]);
  if (direct) return direct;
  return [getNamedValue(form, ["first_name"]), getNamedValue(form, ["last_name"])].filter(Boolean).join(" ");
}

function buildBody(form) {
  return publicFields(form)
    .map((field) => {
      const value = fieldValue(field);
      if (!value) return "";
      return `${fieldLabel(field)}: ${value}`;
    })
    .filter(Boolean)
    .join("\n");
}

function getSubject(form) {
  const subject = getNamedValue(form, ["subject"]);
  if (subject) return subject;
  const app = getNamedValue(form, ["selected-app"]);
  if (app) return `${form.dataset.messageSubject || "App checkout request"}: ${app}`;
  const interest = getNamedValue(form, ["interest", "project-type", "version"]);
  if (interest) return `${form.dataset.messageSubject || "Website message"}: ${interest}`;
  return form.dataset.messageSubject || "Website message";
}

function getRequestType(form) {
  return form.dataset.messageType || getNamedValue(form, ["request_type", "project-type", "interest", "version"]) || "Website message";
}

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

function cleanFileName(name) {
  return String(name || "photo")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

async function uploadAttachments(files, source) {
  if (!files.length) return [];
  const batchId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const day = new Date().toISOString().slice(0, 10);
  const cleanSource = String(source || "site-form").replace(/[^\w\-]+/g, "-").slice(0, 40);
  const uploaded = [];

  for (const file of files) {
    const path = `public-form-uploads/${cleanSource}/${day}/${batchId}/${cleanFileName(file.name)}`;
    const { error } = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false
    });
    if (error) throw error;
    uploaded.push({
      bucket: ATTACHMENT_BUCKET,
      path,
      name: file.name,
      size: file.size,
      type: file.type
    });
  }

  return uploaded;
}

function metadataForForm(form) {
  const entries = {};
  publicFields(form).forEach((field) => {
    const value = fieldValue(field);
    if (value) entries[field.name] = value;
  });
  return {
    form_id: form.id || "",
    form_name: form.dataset.messageSource || form.getAttribute("name") || "site-form",
    fields: entries
  };
}

async function submitNetlifyForm(form, fallbackName) {
  const formName = form.getAttribute("name") || fallbackName || "site-message";
  const data = new FormData(form);
  data.set("form-name", formName);

  const response = await fetch("/", {
    method: "POST",
    body: data
  });
  if (!response.ok) throw new Error(`Netlify form submission failed with ${response.status}`);
}

async function submitNetlifyFormSafely(form, fallbackName) {
  try {
    await submitNetlifyForm(form, fallbackName);
  } catch (error) {
    console.warn("Message was saved, but Netlify form notification submission failed.", error);
  }
}

async function submitForm(form) {
  if (!supabase) throw new Error(copy.setup);
  if (!form.reportValidity()) return;
  const botField = form.elements["bot-field"];
  if (botField && String(botField.value || "").trim()) return;

  const files = collectFiles(form);
  validateFiles(files);

  const source = form.dataset.messageSource || form.getAttribute("name") || "site-form";
  const attachments = await uploadAttachments(files, source);
  const body = buildBody(form);
  const subject = getSubject(form);
  const requestType = getRequestType(form);
  const senderName = buildName(form);
  const senderEmail = getNamedValue(form, ["email", "client_email"]);
  const senderPhone = getNamedValue(form, ["phone", "tel"]);
  const metadata = metadataForForm(form);

  const { error } = await supabase.rpc("submit_site_message", {
    form_source: source,
    request_type: requestType,
    message_subject: subject,
    message_body: body || subject,
    sender_name: senderName,
    sender_email: senderEmail,
    sender_phone: senderPhone,
    page_url: window.location.href,
    metadata,
    attachments
  });
  if (error) throw error;

  await submitNetlifyFormSafely(form, source);
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
