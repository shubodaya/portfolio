import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AdminPortal } from "./twod/AdminPortal.jsx";
import { LogoIntro } from "./components/LogoIntro.jsx";
import { Nav } from "./components/Nav.jsx";
import Scene3D from "./components/Scene3D.jsx";
import { ScrollExperience } from "./components/ScrollExperience.jsx";
import { SmoothScroll } from "./components/SmoothScroll.jsx";
import { getFibreFocusScene, getFibreSignalProgress } from "./components/FibreCable.jsx";
import { scrollState } from "./components/scrollProgressStore.js";
import { profile } from "./data/profileData.js";
import { SiteContentProvider, useSiteContentData } from "./twod/SiteContentContext.jsx";
import { TwoDPortfolio } from "./twod/TwoDPortfolio.jsx";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function linearProgress(value, start, end) {
  return clamp01((value - start) / Math.max(0.0001, end - start));
}

const tileRouteNodes = [
  { id: "about", label: "About", short: "ABT", signal: "About", summary: "Network security profile, support approach, and operating strengths." },
  { id: "experience", label: "Experience", short: "EXP", signal: "Experience", summary: "Firewall, VPN, network support, and field support experience." },
  { id: "projects", label: "Projects", short: "PRJ", signal: "Projects", path: "/projects", summary: "Diagnostics, visibility, security labs, and portfolio systems." },
  { id: "skills", label: "Skills", short: "SKL", signal: "Skills", summary: "Firewall, VPN, networking, cloud, security tooling, and support automation." },
  { id: "certifications", label: "Certifications", short: "CRT", signal: "Certifications", summary: "Networking, cloud, security, and support certifications." },
  { id: "education", label: "Education", short: "EDU", signal: "Education", summary: "Cybersecurity education and supporting technical development." },
  { id: "contact", label: "Contact", short: "CON", signal: "Contact", summary: "Contact routes for network security and infrastructure support work." }
];

function cleanAdminLabel(value, fallback) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function getTileRouteNodes(threeDContent) {
  const tiles = threeDContent?.tiles ?? {};
  const sections = new Map(
    (Array.isArray(threeDContent?.sections) ? threeDContent.sections : [])
      .filter((section) => section?.id)
      .map((section) => [section.id, section])
  );

  return tileRouteNodes.map((node) => ({
    ...node,
    label: cleanAdminLabel(tiles[node.id]?.title ?? sections.get(node.id)?.label, node.label),
    short: cleanAdminLabel(sections.get(node.id)?.short, node.short),
    signal: cleanAdminLabel(sections.get(node.id)?.signal ?? tiles[node.id]?.title, node.signal),
    summary: cleanAdminLabel(tiles[node.id]?.body ?? sections.get(node.id)?.summary, node.summary)
  }));
}

function getScrollNavScene(activeScene, scrollProgress) {
  if (scrollProgress <= 0.104 || scrollProgress >= 0.895) return activeScene;

  return getFibreFocusScene(getFibreSignalProgress(scrollProgress), "hero");
}

function getShutterPhase(scrollProgress) {
  const intro = linearProgress(scrollProgress, 0.018, 0.098);
  if (intro > 0 && intro < 1) return { active: intro, y: -62 + intro * 124 };

  const outro = linearProgress(scrollProgress, 0.91, 0.97);
  if (outro > 0 && outro < 1) return { active: outro, y: 62 - outro * 124 };

  return null;
}

// Driven entirely by motion values so the sweep animates on the compositor
// without a single React re-render per scroll frame.
function JourneyShutter({ progress }) {
  const y = useTransform(progress, (value) => getShutterPhase(value)?.y ?? 0);
  const opacity = useTransform(progress, (value) => {
    const phase = getShutterPhase(value);
    return phase ? Math.sin(phase.active * Math.PI) : 0;
  });
  const display = useTransform(opacity, (value) => (value > 0.001 ? "block" : "none"));
  const shutterY = useMotionTemplate`${y}vh`;

  return (
    <motion.div
      className="journey-shutter"
      aria-hidden="true"
      style={{ "--shutter-y": shutterY, display, opacity }}
    >
      <span className="journey-shutter__blade" />
      <span className="journey-shutter__afterglow" />
    </motion.div>
  );
}

function useActiveScene() {
  const [activeScene, setActiveScene] = useState("hero");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-scene-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveScene(visible.target.id);
        }
      },
      { threshold: [0.22, 0.42, 0.62], rootMargin: "-18% 0px -22% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeScene;
}

function HomeExperienceContent() {
  const { threeDContent } = useSiteContentData();
  const { scrollYProgress } = useScroll();
  const [navScene, setNavScene] = useState("hero");
  const [introComplete, setIntroComplete] = useState(false);
  const [hoveredScene, setHoveredScene] = useState(null);
  const [activeProject, setActiveProject] = useState("netravax");
  const activeScene = useActiveScene();
  const activeSceneRef = useRef(activeScene);
  const routeNodes = useMemo(() => getTileRouteNodes(threeDContent), [threeDContent]);
  const completeIntro = useCallback(() => setIntroComplete(true), []);

  // Continuous progress goes to the shared store (read by the 3D scene each
  // frame); React state only changes when the *discrete* nav scene changes.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollState.progress = value;
    const next = getScrollNavScene(activeSceneRef.current, value);
    setNavScene((previous) => (previous === next ? previous : next));
  });

  useEffect(() => {
    scrollState.progress = scrollYProgress.get();
  }, [scrollYProgress]);

  useEffect(() => {
    activeSceneRef.current = activeScene;
    const next = getScrollNavScene(activeScene, scrollState.progress);
    setNavScene((previous) => (previous === next ? previous : next));
  }, [activeScene]);

  return (
    <div className={`webgl-portfolio ${introComplete ? "is-live" : "is-booting"}`} data-active-scene={activeScene}>
      <SmoothScroll />
      <Scene3D
        activeProject={activeProject}
        activeScene={activeScene}
        hoveredScene={hoveredScene}
        setActiveProject={setActiveProject}
        setHoveredScene={setHoveredScene}
        threeDContent={threeDContent}
      />
      <JourneyShutter progress={scrollYProgress} />

      <Nav activeScene={navScene} onHoverScene={setHoveredScene} routeNodes={routeNodes} />
      <AnimatePresence>
        {!introComplete ? <LogoIntro onComplete={completeIntro} /> : null}
      </AnimatePresence>

      <ScrollExperience
        activeProject={activeProject}
        activeScene={activeScene}
        hero={threeDContent.hero}
        onHoverScene={setHoveredScene}
        profile={threeDContent.profile}
        routeNodes={routeNodes}
        setActiveProject={setActiveProject}
      />

      <div className="webgl-vignette" aria-hidden="true" />
      <div className="webgl-scanlines" aria-hidden="true" />
      <Link className="admin-stealth-entry" to="/admin" aria-label="Owner admin login" title="Owner login">
        a
      </Link>
    </div>
  );
}

function HomeExperience() {
  return (
    <SiteContentProvider>
      <HomeExperienceContent />
    </SiteContentProvider>
  );
}

function AdminExperience() {
  return (
    <SiteContentProvider>
      <div className="twod-clone">
        <AdminPortal />
      </div>
    </SiteContentProvider>
  );
}

function ResumeRedirect() {
  useEffect(() => {
    window.location.replace(profile.links.resume);
  }, []);

  return (
    <div className="resume-redirect">
      <a href={profile.links.resume}>Open Resume</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<HomeExperience />} path="/" />
      <Route element={<TwoDPortfolio sectionId="services" />} path="/services" />
      <Route element={<TwoDPortfolio sectionId="highlights" />} path="/highlights" />
      <Route element={<TwoDPortfolio sectionId="projects" />} path="/featured-projects" />
      <Route element={<TwoDPortfolio sectionId="portfolio-system" />} path="/role-pages" />
      <Route element={<TwoDPortfolio sectionId="insights" />} path="/insights" />
      <Route element={<TwoDPortfolio sectionId="contact" />} path="/contact" />
      <Route element={<TwoDPortfolio mode="catalog" />} path="/catalog" />
      <Route element={<TwoDPortfolio mode="catalog" />} path="/projects" />
      <Route element={<ResumeRedirect />} path="/resume" />
      <Route element={<TwoDPortfolio sectionId="services" />} path="/about" />
      <Route element={<TwoDPortfolio sectionId="highlights" />} path="/experience" />
      <Route element={<TwoDPortfolio mode="catalog" />} path="/skills" />
      <Route element={<TwoDPortfolio mode="catalog" />} path="/certifications" />
      <Route element={<TwoDPortfolio mode="catalog" />} path="/education" />
      <Route element={<AdminExperience />} path="/admin" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
