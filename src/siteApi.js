const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

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

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const requestJson = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const init = {
    credentials: "include",
    ...options,
    headers
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(apiUrl(path), init);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data?.error?.code || "", data?.error?.details || null);
  }

  return data;
};

export const fetchPublicSiteContent = async () => requestJson("/api/site-content");

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
