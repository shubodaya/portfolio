import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  SITE_CONTENT_STORAGE_KEY,
  cloneSiteContent,
  defaultSiteContent,
  getMergedSiteContent,
  readStoredSiteContentOverrides
} from "./data/siteData";

const ADMIN_OWNER_KEY = "portfolio-admin-owner-v1";
const ADMIN_SESSION_KEY = "portfolio-admin-session-v1";

const JSON_SECTIONS = [
  { key: "heroStats", label: "Hero stats" },
  { key: "keywordMarquee", label: "Keyword marquee" },
  { key: "storyTracks", label: "Story tracks" },
  { key: "services", label: "Services" },
  { key: "proofPoints", label: "Experience tiles" },
  { key: "hiringReasons", label: "Why hire me tiles" },
  { key: "blogNotes", label: "Writing notes" },
  { key: "testimonials", label: "Testimonials" }
];

const readJsonStorage = (key, storage) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJsonStorage = (key, value, storage) => {
  if (typeof window === "undefined") {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
};

const readOwner = () => readJsonStorage(ADMIN_OWNER_KEY, window.localStorage);

const hasActiveSession = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "active";
};

const createJsonEditors = (content) =>
  JSON_SECTIONS.reduce((accumulator, section) => {
    accumulator[section.key] = JSON.stringify(content[section.key], null, 2);
    return accumulator;
  }, {});

const initialContent = getMergedSiteContent(readStoredSiteContentOverrides());

const hashPassword = async (value) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
};

const updateByPath = (source, path, value) => {
  const next = cloneSiteContent(source);
  let cursor = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]];
  }

  cursor[path[path.length - 1]] = value;
  return next;
};

const sectionCopyFields = [
  ["hero", "Eyebrow", "eyebrow"],
  ["hero", "Title", "title"],
  ["hero", "Lead paragraph", "lead"],
  ["overview", "Overview eyebrow", "eyebrow"],
  ["overview", "Overview title", "title"],
  ["overview", "Overview paragraph", "body"],
  ["highlights", "Highlights eyebrow", "eyebrow"],
  ["highlights", "Highlights title", "title"],
  ["highlights", "Highlights paragraph", "body"],
  ["projects", "Projects eyebrow", "eyebrow"],
  ["projects", "Projects title", "title"],
  ["projects", "Projects paragraph", "body"],
  ["portfolio", "Sites eyebrow", "eyebrow"],
  ["portfolio", "Sites title", "title"],
  ["portfolio", "Sites paragraph", "body"],
  ["insights", "Insights eyebrow", "eyebrow"],
  ["insights", "Insights title", "title"],
  ["insights", "Insights paragraph", "body"],
  ["contact", "Contact eyebrow", "eyebrow"],
  ["contact", "Contact title", "title"],
  ["contact", "Contact paragraph", "body"],
  ["catalog", "Catalog eyebrow", "eyebrow"],
  ["catalog", "Catalog title", "title"],
  ["catalog", "Catalog paragraph", "body"],
  ["catalogCta", "Catalog CTA eyebrow", "eyebrow"],
  ["catalogCta", "Catalog CTA title", "title"],
  ["catalogCta", "Catalog CTA paragraph", "body"]
];

export function AdminPortal() {
  const [ownerExists, setOwnerExists] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(readOwner());
  });
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return hasActiveSession();
  });
  const [setupForm, setSetupForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [draft, setDraft] = useState(() => cloneSiteContent(initialContent));
  const [jsonEditors, setJsonEditors] = useState(() => createJsonEditors(initialContent));
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentMessage, setContentMessage] = useState("");
  const currentJsonPreview = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const syncDraft = (nextContent) => {
    const cloned = cloneSiteContent(nextContent);
    setDraft(cloned);
    setJsonEditors(createJsonEditors(cloned));
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");

    if (!setupForm.email.trim() || !setupForm.password) {
      setAuthError("Email and password are required.");
      return;
    }

    if (setupForm.password !== setupForm.confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const owner = {
      email: setupForm.email.trim().toLowerCase(),
      passwordHash: await hashPassword(setupForm.password)
    };

    writeJsonStorage(ADMIN_OWNER_KEY, owner, window.localStorage);
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
    setOwnerExists(true);
    setAuthenticated(true);
    setAuthMessage("Owner profile created.");
    setSetupForm({
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    const owner = readOwner();

    if (!owner) {
      setAuthError("Owner setup has not been created yet.");
      return;
    }

    const incomingEmail = loginForm.email.trim().toLowerCase();
    const incomingHash = await hashPassword(loginForm.password);

    if (incomingEmail !== owner.email || incomingHash !== owner.passwordHash) {
      setAuthError("Invalid owner credentials.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
    setAuthenticated(true);
    setAuthMessage("Signed in.");
    setLoginForm({
      email: "",
      password: ""
    });
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setAuthMessage("Signed out.");
  };

  const handleSave = (event) => {
    event.preventDefault();
    setContentError("");
    setContentMessage("");

    try {
      let nextDraft = cloneSiteContent(draft);

      JSON_SECTIONS.forEach((section) => {
        const parsed = JSON.parse(jsonEditors[section.key]);
        nextDraft[section.key] = parsed;
      });

      nextDraft = getMergedSiteContent(nextDraft);
      window.localStorage.setItem(
        SITE_CONTENT_STORAGE_KEY,
        JSON.stringify(nextDraft, null, 2)
      );
      syncDraft(nextDraft);
      setContentMessage(
        "Saved. Open the portfolio in a new tab or refresh the site to load the updated content."
      );
    } catch (error) {
      setContentError(error instanceof Error ? error.message : "Failed to save content.");
    }
  };

  const handleResetDefaults = () => {
    window.localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
    syncDraft(defaultSiteContent);
    setContentError("");
    setContentMessage("Reset to the default portfolio content.");
  };

  const updateSectionCopy = (group, field, value) => {
    setDraft((current) => updateByPath(current, ["sectionCopy", group, field], value));
  };

  const updateContact = (path, value) => {
    setDraft((current) => updateByPath(current, ["contact", ...path], value));
  };

  return (
    <section className="admin-console">
      <header className="admin-console__header">
        <div>
          <p className="admin-console__eyebrow">Owner Console</p>
          <h1>Portfolio content controls</h1>
        </div>
        <div className="admin-console__header-actions">
          <Link className="admin-btn admin-btn--ghost" to="/">
            Open site
          </Link>
          {authenticated ? (
            <button className="admin-btn admin-btn--danger" type="button" onClick={handleLogout}>
              Log out
            </button>
          ) : null}
        </div>
      </header>

      {!ownerExists ? (
        <div className="admin-card admin-card--auth">
          <h2>Create owner login</h2>
          <p className="admin-muted">
            This first pass stores the admin login and saved content in this browser for this site.
          </p>
          <form className="admin-form" onSubmit={handleSetup}>
            <label>
              Owner email
              <input
                type="email"
                value={setupForm.email}
                onChange={(event) =>
                  setSetupForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={setupForm.password}
                onChange={(event) =>
                  setSetupForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={setupForm.confirmPassword}
                onChange={(event) =>
                  setSetupForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value
                  }))
                }
              />
            </label>
            <button className="admin-btn admin-btn--primary" type="submit">
              Create owner
            </button>
          </form>
          {authError || authMessage ? (
            <div className={`admin-alert${authError ? " admin-alert--error" : ""}`}>
              {authError || authMessage}
            </div>
          ) : null}
        </div>
      ) : null}

      {ownerExists && !authenticated ? (
        <div className="admin-card admin-card--auth">
          <h2>Owner login</h2>
          <p className="admin-muted">Use the owner credentials to edit the portfolio copy.</p>
          <form className="admin-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <button className="admin-btn admin-btn--primary" type="submit">
              Sign in
            </button>
          </form>
          {authError || authMessage ? (
            <div className={`admin-alert${authError ? " admin-alert--error" : ""}`}>
              {authError || authMessage}
            </div>
          ) : null}
        </div>
      ) : null}

      {authenticated ? (
        <form className="admin-workspace admin-workspace--single" onSubmit={handleSave}>
          <div className="admin-main">
            <section className="admin-card admin-card--actions admin-card--actions-top">
              <div className="admin-actions">
                <button className="admin-btn admin-btn--primary" type="submit">
                  Save content
                </button>
                <button
                  className="admin-btn admin-btn--ghost"
                  type="button"
                  onClick={handleResetDefaults}
                >
                  Reset to defaults
                </button>
              </div>
              <p className="admin-muted">
                The editor updates site copy, contact details, story sections, and the supporting text collections.
              </p>
              {contentError || contentMessage ? (
                <div
                  className={`admin-alert admin-alert--inline${contentError ? " admin-alert--error" : ""}`}
                >
                  {contentError || contentMessage}
                </div>
              ) : null}
            </section>

            <section className="admin-card">
              <h2>Brand and contact</h2>
              <div className="admin-form admin-form--two-col">
                <label>
                  Name
                  <input
                    type="text"
                    value={draft.contact.name}
                    onChange={(event) => updateContact(["name"], event.target.value)}
                  />
                </label>
                <label>
                  Title
                  <input
                    type="text"
                    value={draft.contact.title}
                    onChange={(event) => updateContact(["title"], event.target.value)}
                  />
                </label>
                <label>
                  Subtitle
                  <input
                    type="text"
                    value={draft.contact.subtitle}
                    onChange={(event) => updateContact(["subtitle"], event.target.value)}
                  />
                </label>
                <label>
                  Location
                  <input
                    type="text"
                    value={draft.contact.location}
                    onChange={(event) => updateContact(["location"], event.target.value)}
                  />
                </label>
                <label>
                  Availability
                  <input
                    type="text"
                    value={draft.contact.availability}
                    onChange={(event) => updateContact(["availability"], event.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={draft.contact.email}
                    onChange={(event) => updateContact(["email"], event.target.value)}
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="text"
                    value={draft.contact.phone}
                    onChange={(event) => updateContact(["phone"], event.target.value)}
                  />
                </label>
                <label>
                  Resume link
                  <input
                    type="url"
                    value={draft.contact.links.resume}
                    onChange={(event) => updateContact(["links", "resume"], event.target.value)}
                  />
                </label>
                <label>
                  LinkedIn link
                  <input
                    type="url"
                    value={draft.contact.links.linkedin}
                    onChange={(event) => updateContact(["links", "linkedin"], event.target.value)}
                  />
                </label>
                <label>
                  GitHub link
                  <input
                    type="url"
                    value={draft.contact.links.github}
                    onChange={(event) => updateContact(["links", "github"], event.target.value)}
                  />
                </label>
                <label>
                  Blog link
                  <input
                    type="url"
                    value={draft.contact.links.blog}
                    onChange={(event) => updateContact(["links", "blog"], event.target.value)}
                  />
                </label>
                <label>
                  YouTube link
                  <input
                    type="url"
                    value={draft.contact.links.youtube}
                    onChange={(event) => updateContact(["links", "youtube"], event.target.value)}
                  />
                </label>
                <label className="admin-form__full">
                  Summary
                  <textarea
                    value={draft.contact.summary}
                    onChange={(event) => updateContact(["summary"], event.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="admin-card">
              <h2>Section copy</h2>
              <div className="admin-form admin-form--two-col">
                {sectionCopyFields.map(([group, label, field]) => (
                  <label
                    className={field === "title" || field === "body" || field === "lead" ? "admin-form__full" : ""}
                    key={`${group}-${field}-${label}`}
                  >
                    {label}
                    {field === "body" || field === "lead" || field === "title" ? (
                      <textarea
                        value={draft.sectionCopy[group][field]}
                        onChange={(event) =>
                          updateSectionCopy(group, field, event.target.value)
                        }
                      />
                    ) : (
                      <input
                        type="text"
                        value={draft.sectionCopy[group][field]}
                        onChange={(event) =>
                          updateSectionCopy(group, field, event.target.value)
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <h2>Structured content</h2>
              <div className="admin-editor-grid">
                {JSON_SECTIONS.map((section) => (
                  <label className="admin-editor" key={section.key}>
                    <span>{section.label}</span>
                    <textarea
                      className="admin-json"
                      value={jsonEditors[section.key]}
                      onChange={(event) =>
                        setJsonEditors((current) => ({
                          ...current,
                          [section.key]: event.target.value
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <h2>Current JSON</h2>
              <p className="admin-muted">
                This is the content snapshot that will be used the next time the portfolio reloads.
              </p>
              <textarea className="admin-json admin-json--readonly" value={currentJsonPreview} readOnly />
            </section>
          </div>
        </form>
      ) : null}
    </section>
  );
}
