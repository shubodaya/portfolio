const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const LOCAL_DEV_WITHOUT_API = import.meta.env.DEV && !API_BASE_URL;
const PUBLIC_CONTACT_EMAIL = "contact@shubodaya.dev";
const LEGACY_CONTACT_EMAIL = ["hns", "hub", "odaya"].join("") + "@gmail.com";

export class ApiError extends Error {
  constructor(message, status, code = "", details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const apiUrl = (path) => `${API_BASE_URL}${path}`;
export const SITE_CONTENT_UPDATED_CHANNEL = "portfolio-site-content-updated";

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const sanitizeLegacyContactEmail = (value) => {
  if (typeof value === "string") {
    return value
      .split(`mailto:${LEGACY_CONTACT_EMAIL}`)
      .join(`mailto:${PUBLIC_CONTACT_EMAIL}`)
      .split(LEGACY_CONTACT_EMAIL)
      .join(PUBLIC_CONTACT_EMAIL);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLegacyContactEmail(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeLegacyContactEmail(item)]));
  }

  return value;
};

const requestJson = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const method = String(options.method || "GET").toUpperCase();
  const requestPath =
    method === "GET"
      ? `${path}${path.includes("?") ? "&" : "?"}_=${Date.now()}`
      : path;

  headers.set("Accept", "application/json");
  if (method === "GET") {
    headers.set("Cache-Control", "no-cache");
  }

  const init = {
    cache: method === "GET" ? "no-store" : "default",
    credentials: "include",
    ...options,
    method,
    headers
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(apiUrl(requestPath), init);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data?.error?.code || "", data?.error?.details || null);
  }

  return sanitizeLegacyContactEmail(data);
};

export const notifySiteContentUpdated = () => {
  const payload = String(Date.now());

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(SITE_CONTENT_UPDATED_CHANNEL);
    channel.postMessage({ updatedAt: payload });
    channel.close();
  }

  try {
    window.localStorage.setItem(SITE_CONTENT_UPDATED_CHANNEL, payload);
  } catch {
    // Private browsing or strict storage settings should not block saving content.
  }
};

export const fetchPublicSiteContent = async () =>
  LOCAL_DEV_WITHOUT_API ? { configured: false, content: {}, updatedAt: "" } : requestJson("/api/site-content");

export const getAdminSetupStatus = async () => requestJson("/api/admin/setup-status");

export const getAdminSession = async () => requestJson("/api/admin/me");

export const registerFirstOwner = async ({ email, password, confirmPassword }) =>
  requestJson("/api/admin/register-first", {
    method: "POST",
    body: {
      email,
      password,
      confirmPassword
    }
  });

export const loginOwner = async ({ email, password }) =>
  requestJson("/api/admin/login", {
    method: "POST",
    body: {
      email,
      password
    }
  });

export const logoutOwner = async (csrfToken) =>
  requestJson("/api/admin/logout", {
    method: "POST",
    headers: csrfToken ? { "x-csrf-token": csrfToken } : undefined,
    body: {}
  });

export const getAdminSiteContent = async () => requestJson("/api/admin/content");

export const updateAdminSiteContent = async ({ content, csrfToken }) =>
  requestJson("/api/admin/content", {
    method: "PUT",
    headers: {
      "x-csrf-token": csrfToken
    },
    body: {
      content
    }
  });
