import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cloneThreeDContent,
  defaultThreeDContent,
  getMergedThreeDContent,
  tileSectionIds
} from "../data/threeDContent";
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

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const sectionCopyGroups = [
  ["brand", "Brand"],
  ["hero", "Hero"],
  ["overview", "Services overview"],
  ["highlights", "Highlights"],
  ["projects", "Projects"],
  ["portfolio", "Role pages"],
  ["insights", "Insights"],
  ["contact", "Contact"],
  ["catalog", "Catalog"],
  ["catalogCta", "Catalog CTA"],
  ["footer", "Footer"]
];

const contentGroups = [
  {
    key: "heroStats",
    title: "Hero stats",
    fields: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" }
    ]
  },
  {
    key: "storyTracks",
    title: "Story tracks",
    fields: [
      { key: "id", label: "ID" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
      { key: "metric", label: "Metric", multiline: true },
      { key: "image", label: "Image path" },
      { key: "alt", label: "Alt text", multiline: true }
    ],
    listFields: [{ key: "outcomes", label: "Outcomes" }]
  },
  {
    key: "services",
    title: "Services",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true }
    ],
    listFields: [{ key: "deliverables", label: "Deliverables" }]
  },
  {
    key: "proofPoints",
    title: "Experience tiles",
    fields: [
      { key: "metric", label: "Metric" },
      { key: "title", label: "Title" },
      { key: "detail", label: "Detail", multiline: true }
    ],
    listFields: [{ key: "tags", label: "Tags" }]
  },
  {
    key: "hiringReasons",
    title: "Role fit tiles",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true }
    ],
    listFields: [{ key: "items", label: "Items" }]
  },
  {
    key: "blogNotes",
    title: "Writing notes",
    fields: [
      { key: "category", label: "Category" },
      { key: "title", label: "Title" },
      { key: "summary", label: "Summary", multiline: true },
      { key: "link", label: "Link" },
      { key: "linkLabel", label: "Link label" }
    ]
  },
  {
    key: "testimonials",
    title: "Testimonials",
    fields: [
      { key: "quote", label: "Quote", multiline: true },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" }
    ]
  }
];

const editableProjectKeys = [
  "title",
  "year",
  "category",
  "type",
  "summary",
  "proof",
  "stack",
  "outcomes",
  "image",
  "alt",
  "featured",
  "links"
];

const buildTreeGroups = (projectEditors) => [
  {
    id: "admin-tree-3d",
    title: "3D page tree",
    links: [
      { id: "admin-3d-profile", label: "Profile and hero" },
      { id: "admin-3d-sections", label: "Route sections" },
      ...tileSectionIds.map((id) => ({ id: `admin-3d-tile-${id}`, label: `Tile: ${defaultThreeDContent.tiles[id]?.title ?? id}` }))
    ]
  },
  {
    id: "admin-tree-2d",
    title: "2D page tree",
    links: [
      { id: "admin-2d-brand", label: "Brand and contact" },
      {
        id: "admin-2d-copy",
        label: "Section copy",
        children: sectionCopyGroups.map(([group, label]) => ({
          id: `admin-2d-copy-${group}`,
          label
        }))
      },
      {
        id: "admin-2d-home",
        label: "Home content",
        children: [
          { id: "admin-2d-keywordMarquee", label: "Keyword marquee" },
          ...contentGroups.map((group) => ({ id: `admin-2d-${group.key}`, label: group.title }))
        ]
      },
      {
        id: "admin-2d-projects",
        label: "Project catalog",
        children: [
          { id: "admin-2d-featured", label: "Featured selector" },
          ...projectEditors.map((project) => ({
            id: `admin-2d-project-${project.slug}`,
            label: project.title || project.slug
          }))
        ]
      }
    ]
  }
];

const defaultExpandedTree = {
  "admin-tree-3d": true,
  "admin-tree-2d": true,
  "admin-2d-copy": false,
  "admin-2d-home": false,
  "admin-2d-projects": false
};

const cloneProjectEditor = (project) => ({
  ...project,
  featured: Boolean(project.featured),
  stack: Array.isArray(project.stack) ? [...project.stack] : [],
  outcomes: Array.isArray(project.outcomes) ? [...project.outcomes] : [],
  links: Array.isArray(project.links) ? project.links.map((link) => ({ ...link })) : []
});

const createProjectEditors = (projects) =>
  projects.map((project) => cloneProjectEditor(project));

const createProjectOverrides = (projects) =>
  projects.reduce((accumulator, project) => {
    const defaultProject = defaultProjects.find((item) => item.slug === project.slug);

    if (!defaultProject) {
      return accumulator;
    }

    const override = {};

    editableProjectKeys.forEach((key) => {
      if (JSON.stringify(project[key]) !== JSON.stringify(defaultProject[key])) {
        override[key] = project[key];
      }
    });

    if (Object.keys(override).length > 0) {
      accumulator[project.slug] = override;
    }

    return accumulator;
  }, {});

const buildAdminContentPayload = (siteContent, threeDContent, projectEditors) => ({
  siteContent,
  threeDContent,
  projectOverrides: createProjectOverrides(projectEditors)
});

const normalizeAdminContentPayload = (payload) => {
  const source = isRecord(payload?.content) ? payload.content : isRecord(payload) ? payload : {};
  const siteContent = getMergedSiteContent(isRecord(source.siteContent) ? source.siteContent : {});
  const threeDContent = getMergedThreeDContent(isRecord(source.threeDContent) ? source.threeDContent : {});
  const projectOverrides = isRecord(source.projectOverrides) ? source.projectOverrides : {};

  return {
    siteContent,
    threeDContent,
    projectOverrides
  };
};

const updateByPath = (source, path, value, clone) => {
  const next = clone(source);
  let cursor = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]];
  }

  cursor[path[path.length - 1]] = value;
  return next;
};

const moveItem = (items, fromIndex, direction) => {
  const toIndex = fromIndex + direction;
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

const emptyObjectFromFields = (fields, listFields = []) => {
  const item = {};
  fields.forEach((field) => {
    item[field.key] = "";
  });
  listFields.forEach((field) => {
    item[field.key] = [""];
  });
  return item;
};

function Field({ label, multiline = false, onChange, readOnly = false, type = "text", value }) {
  return (
    <label>
      {label}
      {multiline ? (
        <textarea readOnly={readOnly} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input readOnly={readOnly} type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function StringListEditor({ addLabel = "Add item", items, label, onChange }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="admin-list-editor">
      <div className="admin-list-editor__head">
        <span>{label}</span>
        <button className="admin-btn admin-btn--ghost admin-btn--small" type="button" onClick={() => onChange([...list, ""])}>
          {addLabel}
        </button>
      </div>
      {list.map((item, index) => (
        <div className="admin-list-row" key={`${label}-${index}`}>
          <input
            type="text"
            value={item}
            onChange={(event) => onChange(list.map((value, itemIndex) => (itemIndex === index ? event.target.value : value)))}
          />
          <button className="admin-btn admin-btn--ghost admin-btn--icon" type="button" onClick={() => onChange(moveItem(list, index, -1))}>
            Up
          </button>
          <button className="admin-btn admin-btn--ghost admin-btn--icon" type="button" onClick={() => onChange(moveItem(list, index, 1))}>
            Down
          </button>
          <button className="admin-btn admin-btn--danger admin-btn--icon" type="button" onClick={() => onChange(list.filter((_, itemIndex) => itemIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function StructuredListEditor({ allowAddRemove = true, allowReorder = true, fields, id, items, listFields = [], onChange, title }) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (index, key, value) => {
    onChange(list.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  return (
    <section className="admin-fieldset" id={id}>
      <div className="admin-fieldset__head">
        <h3>{title}</h3>
        {allowAddRemove ? (
          <button
            className="admin-btn admin-btn--ghost admin-btn--small"
            type="button"
            onClick={() => onChange([...list, emptyObjectFromFields(fields, listFields)])}
          >
            Add
          </button>
        ) : null}
      </div>
      <div className="admin-stack">
        {list.map((item, index) => (
          <article className="admin-repeat-card" key={`${title}-${index}`}>
            <div className="admin-repeat-card__head">
              <strong>{item.title || item.label || item.value || `${title} ${index + 1}`}</strong>
              {allowReorder || allowAddRemove ? (
                <div className="admin-actions admin-actions--compact">
                  {allowReorder ? (
                    <>
                      <button className="admin-btn admin-btn--ghost admin-btn--small" type="button" onClick={() => onChange(moveItem(list, index, -1))}>
                        Up
                      </button>
                      <button className="admin-btn admin-btn--ghost admin-btn--small" type="button" onClick={() => onChange(moveItem(list, index, 1))}>
                        Down
                      </button>
                    </>
                  ) : null}
                  {allowAddRemove ? (
                    <button className="admin-btn admin-btn--danger admin-btn--small" type="button" onClick={() => onChange(list.filter((_, itemIndex) => itemIndex !== index))}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="admin-form admin-form--two-col">
              {fields.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  multiline={field.multiline}
                  readOnly={field.readOnly}
                  value={item[field.key]}
                  onChange={(value) => updateItem(index, field.key, value)}
                />
              ))}
            </div>
            {listFields.map((field) => (
              <StringListEditor
                key={field.key}
                label={field.label}
                items={item[field.key]}
                onChange={(value) => updateItem(index, field.key, value)}
              />
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

const collectExpandableTreeIds = (groups) => {
  const ids = [];

  const collectLinks = (links) => {
    links.forEach((link) => {
      if (link.children?.length) {
        ids.push(link.id);
        collectLinks(link.children);
      }
    });
  };

  groups.forEach((group) => {
    ids.push(group.id);
    collectLinks(group.links);
  });

  return ids;
};

function TreeLinks({ expandedTree, links, level = 0, toggleTree }) {
  return links.map((section) => (
    <div className="admin-tree__item" key={section.id}>
      <div className="admin-tree__row">
        {section.children ? (
          <button
            aria-controls={`${section.id}-children`}
            aria-expanded={Boolean(expandedTree[section.id])}
            className="admin-tree__toggle"
            onClick={() => toggleTree(section.id)}
            type="button"
          >
            {expandedTree[section.id] ? "-" : "+"}
          </button>
        ) : (
          <span className="admin-tree__toggle-spacer" />
        )}
        <a className={`admin-sidebar__link${level > 0 ? " admin-sidebar__link--child" : ""}`} href={`#${section.id}`}>
          {section.label}
        </a>
      </div>
      {section.children && expandedTree[section.id] ? (
        <div className="admin-tree__children" id={`${section.id}-children`}>
          <TreeLinks expandedTree={expandedTree} links={section.children} level={level + 1} toggleTree={toggleTree} />
        </div>
      ) : null}
    </div>
  ));
}

function ThreeDTileEditor({ id, onChange, tile }) {
  const updateTile = (key, value) => {
    onChange({ ...tile, [key]: value });
  };

  return (
    <section className="admin-card" id={`admin-3d-tile-${id}`}>
      <h2>3D tile: {tile.title || id}</h2>
      <div className="admin-form admin-form--two-col">
        <Field label="Kicker" value={tile.kicker} onChange={(value) => updateTile("kicker", value)} />
        <Field label="Title" value={tile.title} onChange={(value) => updateTile("title", value)} />
        <Field label="Tile logo path" value={tile.icon} onChange={(value) => updateTile("icon", value)} />
        <Field label="Background image path" value={tile.image} onChange={(value) => updateTile("image", value)} />
        <Field label="Body" multiline value={tile.body} onChange={(value) => updateTile("body", value)} />
      </div>
      <StringListEditor label="Tile lines" items={tile.lines} onChange={(value) => updateTile("lines", value)} />
    </section>
  );
}

function ProjectLinksEditor({ links, onChange }) {
  const list = Array.isArray(links) ? links : [];
  const updateLink = (index, key, value) => {
    onChange(list.map((link, linkIndex) => (linkIndex === index ? { ...link, [key]: value } : link)));
  };

  return (
    <div className="admin-list-editor">
      <div className="admin-list-editor__head">
        <span>Links</span>
        <button className="admin-btn admin-btn--ghost admin-btn--small" type="button" onClick={() => onChange([...list, { label: "", url: "" }])}>
          Add link
        </button>
      </div>
      {list.map((link, index) => (
        <div className="admin-link-row" key={`project-link-${index}`}>
          <input type="text" value={link.label ?? ""} placeholder="Label" onChange={(event) => updateLink(index, "label", event.target.value)} />
          <input type="url" value={link.url ?? ""} placeholder="URL" onChange={(event) => updateLink(index, "url", event.target.value)} />
          <button className="admin-btn admin-btn--ghost admin-btn--icon" type="button" onClick={() => onChange(moveItem(list, index, -1))}>
            Up
          </button>
          <button className="admin-btn admin-btn--ghost admin-btn--icon" type="button" onClick={() => onChange(moveItem(list, index, 1))}>
            Down
          </button>
          <button className="admin-btn admin-btn--danger admin-btn--icon" type="button" onClick={() => onChange(list.filter((_, linkIndex) => linkIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function ProjectCatalogEditor({ onChange, projects }) {
  const updateProject = (index, key, value) => {
    onChange(projects.map((project, projectIndex) => (projectIndex === index ? { ...project, [key]: value } : project)));
  };

  return (
    <section className="admin-card" id="admin-2d-projects">
      <h2>2D project catalog</h2>
      <p className="admin-muted">Edit project and catalog entries used by the 2D landing page and catalog pages.</p>
      <div className="admin-stack">
        {projects.map((project, index) => (
          <article className="admin-repeat-card" id={`admin-2d-project-${project.slug}`} key={project.slug}>
            <div className="admin-repeat-card__head">
              <strong>{project.title || project.slug}</strong>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(project.featured)}
                  onChange={(event) => updateProject(index, "featured", event.target.checked)}
                />
                Featured
              </label>
            </div>
            <div className="admin-form admin-form--two-col">
              <Field label="Slug" readOnly value={project.slug} onChange={() => {}} />
              <Field label="Title" value={project.title} onChange={(value) => updateProject(index, "title", value)} />
              <Field label="Year" value={project.year} onChange={(value) => updateProject(index, "year", value)} />
              <Field label="Category" value={project.category} onChange={(value) => updateProject(index, "category", value)} />
              <Field label="Type" value={project.type} onChange={(value) => updateProject(index, "type", value)} />
              <Field label="Image path" value={project.image} onChange={(value) => updateProject(index, "image", value)} />
              <Field label="Alt text" multiline value={project.alt} onChange={(value) => updateProject(index, "alt", value)} />
              <Field label="Summary" multiline value={project.summary} onChange={(value) => updateProject(index, "summary", value)} />
              <Field label="Proof" multiline value={project.proof} onChange={(value) => updateProject(index, "proof", value)} />
            </div>
            <StringListEditor label="Stack" items={project.stack} onChange={(value) => updateProject(index, "stack", value)} />
            <StringListEditor label="Outcomes" items={project.outcomes} onChange={(value) => updateProject(index, "outcomes", value)} />
            <ProjectLinksEditor links={project.links} onChange={(value) => updateProject(index, "links", value)} />
          </article>
        ))}
      </div>
    </section>
  );
}

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
  const [threeDDraft, setThreeDDraft] = useState(() => cloneThreeDContent(defaultThreeDContent));
  const [projectEditors, setProjectEditors] = useState(() => createProjectEditors(defaultProjects));
  const [authBusy, setAuthBusy] = useState(false);
  const [contentBusy, setContentBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentMessage, setContentMessage] = useState("");
  const [expandedTree, setExpandedTree] = useState(() => ({ ...defaultExpandedTree }));
  const ownerExists = !session.setupRequired;
  const authenticated = session.authenticated;
  const adminTreeGroups = buildTreeGroups(projectEditors);

  const toggleTree = (id) => {
    setExpandedTree((current) => ({
      ...current,
      [id]: !current[id]
    }));
  };

  const expandTree = (expanded) => {
    const next = {};
    collectExpandableTreeIds(adminTreeGroups).forEach((id) => {
      next[id] = expanded;
    });
    setExpandedTree(next);
  };

  const syncDraft = (nextContent, nextThreeDContent) => {
    setDraft(cloneSiteContent(nextContent));
    setThreeDDraft(cloneThreeDContent(nextThreeDContent));
  };

  const applySavedContent = (payload) => {
    const normalized = normalizeAdminContentPayload(payload);
    const mergedProjects = getMergedProjects(normalized.projectOverrides);
    const editors = createProjectEditors(mergedProjects);
    syncDraft(normalized.siteContent, normalized.threeDContent);
    setProjectEditors(editors);
    applyServerContent({
      configured: Boolean(payload?.configured),
      updatedAt: typeof payload?.updatedAt === "string" ? payload.updatedAt : "",
      content: buildAdminContentPayload(normalized.siteContent, normalized.threeDContent, editors)
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

        if (cancelled) return;

        setSession({
          checked: true,
          setupRequired: Boolean(sessionPayload?.setupRequired),
          authenticated: Boolean(sessionPayload?.authenticated),
          email: typeof sessionPayload?.email === "string" ? sessionPayload.email : "",
          csrfToken: typeof sessionPayload?.csrfToken === "string" ? sessionPayload.csrfToken : ""
        });

        if (sessionPayload?.authenticated) {
          const contentPayload = await getAdminSiteContent();

          if (cancelled) return;

          applySavedContent(contentPayload);
        }
      } catch (error) {
        if (!cancelled) {
          setSession((current) => ({
            ...current,
            checked: true
          }));
          setAuthError(error instanceof Error ? error.message : "Unable to load the shared admin session.");
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
    if (!authenticated) return;

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

    const nextDraft = getMergedSiteContent(draft);
    const nextThreeDDraft = getMergedThreeDContent(threeDDraft);

    if (!session.csrfToken) {
      setContentError("Your admin session is missing a CSRF token. Please log in again.");
      return;
    }

    setContentBusy(true);

    try {
      const response = await updateAdminSiteContent({
        content: buildAdminContentPayload(nextDraft, nextThreeDDraft, projectEditors),
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
    syncDraft(defaultSiteContent, defaultThreeDContent);
    setProjectEditors(createProjectEditors(defaultProjects));
    setContentError("");
    setContentMessage("Editor reset to the default portfolio content. Save to publish it.");
  };

  const updateSite = (path, value) => {
    setDraft((current) => updateByPath(current, path, value, cloneSiteContent));
  };

  const updateThreeD = (path, value) => {
    setThreeDDraft((current) => updateByPath(current, path, value, cloneThreeDContent));
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
            <button className="admin-btn admin-btn--danger" type="button" onClick={handleLogout} disabled={authBusy}>
              Log out
            </button>
          ) : null}
        </div>
      </header>

      {!session.checked ? (
        <div className="admin-card admin-card--auth">
          <h2>Loading admin</h2>
          <p className="admin-muted">Checking the shared owner account and loading the current saved content.</p>
        </div>
      ) : null}

      {session.checked && !ownerExists ? (
        <div className="admin-card admin-card--auth">
          <h2>Create owner login</h2>
          <p className="admin-muted">This creates the single shared owner account for the live portfolio backend.</p>
          <form className="admin-form" onSubmit={handleSetup}>
            <Field label="Owner email" type="email" value={setupForm.email} onChange={(value) => setSetupForm((current) => ({ ...current, email: value }))} />
            <Field label="Password" type="password" value={setupForm.password} onChange={(value) => setSetupForm((current) => ({ ...current, password: value }))} />
            <Field label="Confirm password" type="password" value={setupForm.confirmPassword} onChange={(value) => setSetupForm((current) => ({ ...current, confirmPassword: value }))} />
            <button className="admin-btn admin-btn--primary" type="submit" disabled={authBusy}>
              {authBusy ? "Creating..." : "Create owner"}
            </button>
          </form>
          {authError || authMessage ? <div className={`admin-alert${authError ? " admin-alert--error" : ""}`}>{authError || authMessage}</div> : null}
        </div>
      ) : null}

      {session.checked && ownerExists && !authenticated ? (
        <div className="admin-card admin-card--auth">
          <h2>Owner login</h2>
          <p className="admin-muted">Use the shared owner account to edit and publish portfolio content from any browser.</p>
          <form className="admin-form" onSubmit={handleLogin}>
            <Field label="Email" type="email" value={loginForm.email} onChange={(value) => setLoginForm((current) => ({ ...current, email: value }))} />
            <Field label="Password" type="password" value={loginForm.password} onChange={(value) => setLoginForm((current) => ({ ...current, password: value }))} />
            <button className="admin-btn admin-btn--primary" type="submit" disabled={authBusy}>
              {authBusy ? "Signing in..." : "Sign in"}
            </button>
          </form>
          {authError || authMessage ? <div className={`admin-alert${authError ? " admin-alert--error" : ""}`}>{authError || authMessage}</div> : null}
        </div>
      ) : null}

      {authenticated ? (
        <form className="admin-workspace" onSubmit={handleSave}>
          <aside className="admin-sidebar">
            <div className="admin-sidebar__panel">
              <p className="admin-console__eyebrow">Section tree</p>
              <div className="admin-tree__controls" aria-label="Section tree controls">
                <button className="admin-tree__control" type="button" onClick={() => expandTree(true)}>
                  Expand all
                </button>
                <button className="admin-tree__control" type="button" onClick={() => expandTree(false)}>
                  Collapse all
                </button>
              </div>
              <a className="admin-sidebar__link" href="#admin-publish">
                Publish
              </a>
              {adminTreeGroups.map((group) => (
                <div className="admin-tree" key={group.title}>
                  <button
                    aria-controls={`${group.id}-children`}
                    aria-expanded={Boolean(expandedTree[group.id])}
                    className="admin-tree__group-toggle"
                    onClick={() => toggleTree(group.id)}
                    type="button"
                  >
                    <span>{group.title}</span>
                    <b>{expandedTree[group.id] ? "-" : "+"}</b>
                  </button>
                  {expandedTree[group.id] ? (
                    <nav className="admin-sidebar__nav" id={`${group.id}-children`} aria-label={group.title}>
                      <TreeLinks expandedTree={expandedTree} links={group.links} toggleTree={toggleTree} />
                    </nav>
                  ) : null}
                </div>
              ))}
            </div>
          </aside>

          <div className="admin-main">
            <section className="admin-card admin-card--actions admin-card--actions-top" id="admin-publish">
              <div className="admin-actions">
                <button className="admin-btn admin-btn--primary" type="submit" disabled={contentBusy}>
                  {contentBusy ? "Saving..." : "Save content"}
                </button>
                <button className="admin-btn admin-btn--ghost" type="button" onClick={handleReloadSaved} disabled={contentBusy}>
                  Reload saved
                </button>
                <button className="admin-btn admin-btn--ghost" type="button" onClick={handleResetDefaults} disabled={contentBusy}>
                  Reset to defaults
                </button>
              </div>
              <p className="admin-muted">Edits are grouped by the 3D page tree and the 2D page tree. No raw JSON editing is required.</p>
              {contentError || contentMessage ? (
                <div className={`admin-alert admin-alert--inline${contentError ? " admin-alert--error" : ""}`}>{contentError || contentMessage}</div>
              ) : null}
            </section>

            <section className="admin-card" id="admin-3d-profile">
              <h2>3D profile and hero</h2>
              <div className="admin-form admin-form--two-col">
                <Field label="Name" value={threeDDraft.profile.name} onChange={(value) => updateThreeD(["profile", "name"], value)} />
                <Field label="Title" value={threeDDraft.profile.title} onChange={(value) => updateThreeD(["profile", "title"], value)} />
                <Field label="Subtitle" multiline value={threeDDraft.profile.subtitle} onChange={(value) => updateThreeD(["profile", "subtitle"], value)} />
                <Field label="Availability" value={threeDDraft.profile.availability} onChange={(value) => updateThreeD(["profile", "availability"], value)} />
                <Field label="Email" type="email" value={threeDDraft.profile.email} onChange={(value) => updateThreeD(["profile", "email"], value)} />
                <Field label="Phone" value={threeDDraft.profile.phone} onChange={(value) => updateThreeD(["profile", "phone"], value)} />
                <Field label="Resume link" value={threeDDraft.profile.links.resume} onChange={(value) => updateThreeD(["profile", "links", "resume"], value)} />
                <Field label="LinkedIn link" value={threeDDraft.profile.links.linkedin} onChange={(value) => updateThreeD(["profile", "links", "linkedin"], value)} />
                <Field label="GitHub link" value={threeDDraft.profile.links.github} onChange={(value) => updateThreeD(["profile", "links", "github"], value)} />
                <Field label="Blog link" value={threeDDraft.profile.links.blog} onChange={(value) => updateThreeD(["profile", "links", "blog"], value)} />
                <Field label="Hero kicker" value={threeDDraft.hero.kicker} onChange={(value) => updateThreeD(["hero", "kicker"], value)} />
                <Field label="Hero body" multiline value={threeDDraft.hero.body} onChange={(value) => updateThreeD(["hero", "body"], value)} />
                <Field label="Services button" value={threeDDraft.hero.servicesLabel} onChange={(value) => updateThreeD(["hero", "servicesLabel"], value)} />
                <Field label="Projects button" value={threeDDraft.hero.projectsLabel} onChange={(value) => updateThreeD(["hero", "projectsLabel"], value)} />
                <Field label="Contact button" value={threeDDraft.hero.contactLabel} onChange={(value) => updateThreeD(["hero", "contactLabel"], value)} />
                <Field label="Resume button" value={threeDDraft.hero.resumeLabel} onChange={(value) => updateThreeD(["hero", "resumeLabel"], value)} />
              </div>
              <StringListEditor label="Hero title lines" items={threeDDraft.hero.titleLines} onChange={(value) => updateThreeD(["hero", "titleLines"], value)} />
            </section>

            <section className="admin-card" id="admin-3d-sections">
              <h2>3D route sections</h2>
              <StructuredListEditor
                title="Navigation and scroll sections"
                items={threeDDraft.sections}
                onChange={(value) => updateThreeD(["sections"], value)}
                allowAddRemove={false}
                allowReorder={false}
                fields={[
                  { key: "id", label: "Section ID", readOnly: true },
                  { key: "label", label: "Label" },
                  { key: "short", label: "Short nav" },
                  { key: "signal", label: "Signal" },
                  { key: "path", label: "Route/path" },
                  { key: "summary", label: "Hidden section summary", multiline: true }
                ]}
              />
            </section>

            {tileSectionIds.map((id) => (
              <ThreeDTileEditor
                id={id}
                key={id}
                tile={threeDDraft.tiles[id] ?? defaultThreeDContent.tiles[id]}
                onChange={(value) => updateThreeD(["tiles", id], value)}
              />
            ))}

            <section className="admin-card" id="admin-2d-brand">
              <h2>2D brand and contact</h2>
              <div className="admin-form admin-form--two-col">
                <Field label="Name" value={draft.contact.name} onChange={(value) => updateSite(["contact", "name"], value)} />
                <Field label="Title" value={draft.contact.title} onChange={(value) => updateSite(["contact", "title"], value)} />
                <Field label="Subtitle" value={draft.contact.subtitle} onChange={(value) => updateSite(["contact", "subtitle"], value)} />
                <Field label="Location" value={draft.contact.location} onChange={(value) => updateSite(["contact", "location"], value)} />
                <Field label="Availability" value={draft.contact.availability} onChange={(value) => updateSite(["contact", "availability"], value)} />
                <Field label="Email" type="email" value={draft.contact.email} onChange={(value) => updateSite(["contact", "email"], value)} />
                <Field label="Phone" value={draft.contact.phone} onChange={(value) => updateSite(["contact", "phone"], value)} />
                <Field label="Resume link" value={draft.contact.links.resume} onChange={(value) => updateSite(["contact", "links", "resume"], value)} />
                <Field label="LinkedIn link" value={draft.contact.links.linkedin} onChange={(value) => updateSite(["contact", "links", "linkedin"], value)} />
                <Field label="GitHub link" value={draft.contact.links.github} onChange={(value) => updateSite(["contact", "links", "github"], value)} />
                <Field label="Blog link" value={draft.contact.links.blog} onChange={(value) => updateSite(["contact", "links", "blog"], value)} />
                <Field label="YouTube link" value={draft.contact.links.youtube} onChange={(value) => updateSite(["contact", "links", "youtube"], value)} />
                <Field label="Summary" multiline value={draft.contact.summary} onChange={(value) => updateSite(["contact", "summary"], value)} />
              </div>
            </section>

            <section className="admin-card" id="admin-2d-copy">
              <h2>2D section copy</h2>
              <div className="admin-stack">
                {sectionCopyGroups.map(([group, label]) => (
                  <section className="admin-fieldset" id={`admin-2d-copy-${group}`} key={group}>
                    <h3>{label}</h3>
                    <div className="admin-form admin-form--two-col">
                      {Object.keys(draft.sectionCopy[group]).map((field) => (
                        <Field
                          key={`${group}-${field}`}
                          label={field}
                          multiline={["body", "lead", "title"].includes(field)}
                          value={draft.sectionCopy[group][field]}
                          onChange={(value) => updateSite(["sectionCopy", group, field], value)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section className="admin-card" id="admin-2d-home">
              <h2>2D home content</h2>
              <div className="admin-stack">
                <section className="admin-fieldset">
                  <span id="admin-2d-keywordMarquee" className="admin-anchor" />
                  <h3>Keyword marquee</h3>
                  <StringListEditor label="Keywords" items={draft.keywordMarquee} onChange={(value) => updateSite(["keywordMarquee"], value)} />
                </section>
                {contentGroups.map((group) => (
                  <StructuredListEditor
                    id={`admin-2d-${group.key}`}
                    key={group.key}
                    title={group.title}
                    fields={group.fields}
                    listFields={group.listFields}
                    items={draft[group.key]}
                    onChange={(value) => updateSite([group.key], value)}
                  />
                ))}
              </div>
            </section>

            <section className="admin-card" id="admin-2d-featured">
              <h2>2D featured work</h2>
              <p className="admin-muted">Choose which projects appear in the landing-page featured section.</p>
              <div className="admin-project-grid">
                {projectEditors.map((project) => (
                  <label className="admin-project-toggle" key={project.slug}>
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(event) =>
                        setProjectEditors((current) =>
                          current.map((item) => (item.slug === project.slug ? { ...item, featured: event.target.checked } : item))
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
            <ProjectCatalogEditor projects={projectEditors} onChange={setProjectEditors} />
          </div>
        </form>
      ) : null}
    </section>
  );
}
