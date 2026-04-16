import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cloneSiteContent, defaultSiteContent, getMergedSiteContent } from "./data/siteData";
import { defaultProjects, getMergedProjects } from "./data/projectCatalog";
import { useSiteContentData } from "./SiteContentContext";
import {
  getAdminSession,
  getAdminSiteContent,
  loginOwner,
  logoutOwner,
  registerFirstOwner,
  updateAdminSiteContent
} from "./siteApi";

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

const ADMIN_SECTIONS = [
  { id: "admin-publish", label: "Publish" },
  { id: "admin-brand", label: "Brand and contact" },
  { id: "admin-copy", label: "Section copy" },
  { id: "admin-featured", label: "Featured work" },
  { id: "admin-structured", label: "Structured content" },
  { id: "admin-json", label: "Current JSON" }
];

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const createJsonEditors = (content) =>
  JSON_SECTIONS.reduce((accumulator, section) => {
    accumulator[section.key] = JSON.stringify(content[section.key], null, 2);
    return accumulator;
  }, {});

const createProjectEditors = (projects) =>
  projects
    .filter((project) => project.category !== "Portfolio Systems")
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      category: project.category,
      featured: Boolean(project.featured)
    }));

const createProjectOverrides = (projects) =>
  projects.reduce((accumulator, project) => {
    const defaultProject = defaultProjects.find((item) => item.slug === project.slug);

    if (!defaultProject || project.featured === defaultProject.featured) {
      return accumulator;
    }

    accumulator[project.slug] = {
      featured: project.featured
    };

    return accumulator;
  }, {});

const buildAdminContentPayload = (siteContent, projectEditors) => ({
  siteContent,
  projectOverrides: createProjectOverrides(projectEditors)
});

const normalizeAdminContentPayload = (payload) => {
  const source = isRecord(payload?.content) ? payload.content : isRecord(payload) ? payload : {};
  const siteContent = getMergedSiteContent(isRecord(source.siteContent) ? source.siteContent : {});
  const projectOverrides = isRecord(source.projectOverrides) ? source.projectOverrides : {};

  return {
    siteContent,
    projectOverrides
  };
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
  ["catalogCta", "Catalog CTA paragraph", "body"],
  ["footer", "Footer eyebrow", "eyebrow"],
  ["footer", "Footer services title", "servicesTitle"],
  ["footer", "Footer categories title", "categoriesTitle"],
  ["footer", "Footer reach title", "reachTitle"]
];

export function AdminPortal() {
  const { applyServerContent } = useSiteContentData();
  const [session, setSession] = useState({
    checked: false,
    setupRequired: true,
    authenticated: false,
    email: "",
    csrfToken: ""
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
  const [draft, setDraft] = useState(() => cloneSiteContent(defaultSiteContent));
  const [jsonEditors, setJsonEditors] = useState(() => createJsonEditors(defaultSiteContent));
  const [projectEditors, setProjectEditors] = useState(() => createProjectEditors(defaultProjects));
  const [authBusy, setAuthBusy] = useState(false);
  const [contentBusy, setContentBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentMessage, setContentMessage] = useState("");
  const ownerExists = !session.setupRequired;
  const authenticated = session.authenticated;
  const currentJsonPreview = useMemo(
    () => JSON.stringify(buildAdminContentPayload(draft, projectEditors), null, 2),
    [draft, projectEditors]
  );

  const syncDraft = (nextContent) => {
    const cloned = cloneSiteContent(nextContent);
    setDraft(cloned);
    setJsonEditors(createJsonEditors(cloned));
  };

  const applySavedContent = (payload) => {
    const normalized = normalizeAdminContentPayload(payload);
    const mergedProjects = getMergedProjects(normalized.projectOverrides);
    const editors = createProjectEditors(mergedProjects);
    syncDraft(normalized.siteContent);
    setProjectEditors(editors);
    applyServerContent({
      configured: Boolean(payload?.configured),
      updatedAt: typeof payload?.updatedAt === "string" ? payload.updatedAt : "",
      content: buildAdminContentPayload(normalized.siteContent, editors)
    });
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setAuthBusy(true);
      setContentBusy(true);
      setAuthError("");

      try {
        const sessionPayload = await getAdminSession();

        if (cancelled) {
          return;
        }

        setSession({
          checked: true,
          setupRequired: Boolean(sessionPayload?.setupRequired),
          authenticated: Boolean(sessionPayload?.authenticated),
          email: typeof sessionPayload?.email === "string" ? sessionPayload.email : "",
          csrfToken: typeof sessionPayload?.csrfToken === "string" ? sessionPayload.csrfToken : ""
        });

        if (sessionPayload?.authenticated) {
          const contentPayload = await getAdminSiteContent();

          if (cancelled) {
            return;
          }

          applySavedContent(contentPayload);
        }
      } catch (error) {
        if (!cancelled) {
          setSession((current) => ({
            ...current,
            checked: true
          }));
          setAuthError(
            error instanceof Error
              ? error.message
              : "Unable to load the shared admin session."
          );
        }
      } finally {
        if (!cancelled) {
          setAuthBusy(false);
          setContentBusy(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

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

    setAuthBusy(true);

    try {
      const response = await registerFirstOwner({
        email: setupForm.email,
        password: setupForm.password,
        confirmPassword: setupForm.confirmPassword
      });

      setSession({
        checked: true,
        setupRequired: false,
        authenticated: true,
        email: typeof response?.email === "string" ? response.email : setupForm.email.trim(),
        csrfToken: typeof response?.csrfToken === "string" ? response.csrfToken : ""
      });
      applySavedContent({});
      setAuthMessage("Owner account created. This admin is now shared across browsers and devices.");
      setSetupForm({
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to create the owner account.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");

    setAuthBusy(true);
    setContentBusy(true);

    try {
      const response = await loginOwner({
        email: loginForm.email,
        password: loginForm.password
      });

      setSession({
        checked: true,
        setupRequired: false,
        authenticated: true,
        email: typeof response?.email === "string" ? response.email : loginForm.email.trim(),
        csrfToken: typeof response?.csrfToken === "string" ? response.csrfToken : ""
      });

      const contentPayload = await getAdminSiteContent();
      applySavedContent(contentPayload);
      setAuthMessage("Signed in.");
      setLoginForm({
        email: "",
        password: ""
      });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setAuthBusy(false);
      setContentBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    setAuthError("");

    try {
      await logoutOwner(session.csrfToken);
      setSession((current) => ({
        ...current,
        authenticated: false,
        csrfToken: "",
        email: "",
        checked: true
      }));
      setAuthMessage("Signed out.");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleReloadSaved = async () => {
    if (!authenticated) {
      return;
    }

    setContentBusy(true);
    setContentError("");
    setContentMessage("");

    try {
      const payload = await getAdminSiteContent();
      applySavedContent(payload);
      setContentMessage("Reloaded the latest saved content from the shared admin backend.");
    } catch (error) {
      setContentError(error instanceof Error ? error.message : "Failed to reload saved content.");
    } finally {
      setContentBusy(false);
    }
  };

  const handleSave = async (event) => {
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
      if (!session.csrfToken) {
        setContentError("Your admin session is missing a CSRF token. Please log in again.");
        return;
      }

      setContentBusy(true);

      const response = await updateAdminSiteContent({
        content: buildAdminContentPayload(nextDraft, projectEditors),
        csrfToken: session.csrfToken
      });

      applySavedContent(response);
      setContentMessage("Saved to the shared admin backend.");
    } catch (error) {
      setContentError(error instanceof Error ? error.message : "Failed to save content.");
    } finally {
      setContentBusy(false);
    }
  };

  const handleResetDefaults = () => {
    syncDraft(defaultSiteContent);
    setProjectEditors(createProjectEditors(defaultProjects));
    setContentError("");
    setContentMessage("Editor reset to the default portfolio content. Save to publish it.");
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
            <button
              className="admin-btn admin-btn--danger"
              type="button"
              onClick={handleLogout}
              disabled={authBusy}
            >
              Log out
            </button>
          ) : null}
        </div>
      </header>

      {!session.checked ? (
        <div className="admin-card admin-card--auth">
          <h2>Loading admin</h2>
          <p className="admin-muted">
            Checking the shared owner account and loading the current saved content.
          </p>
        </div>
      ) : null}

      {session.checked && !ownerExists ? (
        <div className="admin-card admin-card--auth">
          <h2>Create owner login</h2>
          <p className="admin-muted">
            This creates the single shared owner account for the live portfolio backend.
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
            <button className="admin-btn admin-btn--primary" type="submit" disabled={authBusy}>
              {authBusy ? "Creating..." : "Create owner"}
            </button>
          </form>
          {authError || authMessage ? (
            <div className={`admin-alert${authError ? " admin-alert--error" : ""}`}>
              {authError || authMessage}
            </div>
          ) : null}
        </div>
      ) : null}

      {session.checked && ownerExists && !authenticated ? (
        <div className="admin-card admin-card--auth">
          <h2>Owner login</h2>
          <p className="admin-muted">
            Use the shared owner account to edit and publish portfolio content from any browser.
          </p>
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
            <button className="admin-btn admin-btn--primary" type="submit" disabled={authBusy}>
              {authBusy ? "Signing in..." : "Sign in"}
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
        <form className="admin-workspace" onSubmit={handleSave}>
          <aside className="admin-sidebar">
            <div className="admin-sidebar__panel">
              <p className="admin-console__eyebrow">Sections</p>
              <nav className="admin-sidebar__nav" aria-label="Admin sections">
                {ADMIN_SECTIONS.map((section) => (
                  <a className="admin-sidebar__link" href={`#${section.id}`} key={section.id}>
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="admin-main">
            <section className="admin-card admin-card--actions admin-card--actions-top" id="admin-publish">
              <div className="admin-actions">
                <button className="admin-btn admin-btn--primary" type="submit" disabled={contentBusy}>
                  {contentBusy ? "Saving..." : "Save content"}
                </button>
                <button
                  className="admin-btn admin-btn--ghost"
                  type="button"
                  onClick={handleReloadSaved}
                  disabled={contentBusy}
                >
                  Reload saved
                </button>
                <button
                  className="admin-btn admin-btn--ghost"
                  type="button"
                  onClick={handleResetDefaults}
                  disabled={contentBusy}
                >
                  Reset to defaults
                </button>
              </div>
              <p className="admin-muted">
                The editor writes to the shared backend, so the saved content is the same across devices and browsers.
              </p>
              {contentError || contentMessage ? (
                <div
                  className={`admin-alert admin-alert--inline${contentError ? " admin-alert--error" : ""}`}
                >
                  {contentError || contentMessage}
                </div>
              ) : null}
            </section>

            <section className="admin-card" id="admin-brand">
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

            <section className="admin-card" id="admin-copy">
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

            <section className="admin-card" id="admin-featured">
              <h2>Featured work</h2>
              <p className="admin-muted">
                Choose which projects appear in the landing-page featured section.
              </p>
              <div className="admin-project-grid">
                {projectEditors.map((project) => (
                  <label className="admin-project-toggle" key={project.slug}>
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(event) =>
                        setProjectEditors((current) =>
                          current.map((item) =>
                            item.slug === project.slug
                              ? { ...item, featured: event.target.checked }
                              : item
                          )
                        )
                      }
                    />
                    <div className="admin-project-toggle__copy">
                      <strong>{project.title}</strong>
                      <span>{project.category}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="admin-card" id="admin-structured">
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

            <section className="admin-card" id="admin-json">
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
