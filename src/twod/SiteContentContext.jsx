import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent, getMergedSiteContent } from "./data/siteData";
import { defaultProjects, getMergedProjects, projectCategories } from "./data/projectCatalog";
import { fetchPublicSiteContent } from "./siteApi";

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const SiteContentContext = createContext({
  loaded: false,
  configured: false,
  updatedAt: "",
  siteContent: defaultSiteContent,
  projects: defaultProjects,
  projectCategories,
  applyServerContent: () => {},
  refreshContent: async () => {}
});

const normalizeContentPayload = (payload) => {
  const source = isRecord(payload?.content) ? payload.content : isRecord(payload) ? payload : {};
  const siteContent = isRecord(source.siteContent) ? source.siteContent : {};
  const projectOverrides = isRecord(source.projectOverrides) ? source.projectOverrides : {};

  return {
    configured: Boolean(payload?.configured),
    updatedAt: typeof payload?.updatedAt === "string" ? payload.updatedAt : "",
    siteContent,
    projectOverrides
  };
};

export function SiteContentProvider({ children }) {
  const [remoteContent, setRemoteContent] = useState(() => normalizeContentPayload(null));
  const [loaded, setLoaded] = useState(false);
  const applyServerContent = useCallback((payload) => {
    setRemoteContent(normalizeContentPayload(payload));
  }, []);

  const refreshContent = useCallback(async () => {
    const payload = await fetchPublicSiteContent();
    const normalized = normalizeContentPayload(payload);
    setRemoteContent(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        const payload = await fetchPublicSiteContent();

        if (!cancelled) {
          setRemoteContent(normalizeContentPayload(payload));
        }
      } catch {
        // Local Vite dev and transient API failures should fall back to bundled content.
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    };

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const siteContent = useMemo(
    () => getMergedSiteContent(remoteContent.siteContent),
    [remoteContent.siteContent]
  );
  const projects = useMemo(
    () => getMergedProjects(remoteContent.projectOverrides),
    [remoteContent.projectOverrides]
  );

  const value = useMemo(
    () => ({
      loaded,
      configured: remoteContent.configured,
      updatedAt: remoteContent.updatedAt,
      siteContent,
      projects,
      projectCategories,
      applyServerContent,
      refreshContent
    }),
    [
      loaded,
      remoteContent.configured,
      remoteContent.updatedAt,
      siteContent,
      projects,
      applyServerContent,
      refreshContent
    ]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export const useSiteContentData = () => useContext(SiteContentContext);
