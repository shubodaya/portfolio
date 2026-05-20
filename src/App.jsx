import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AdminPortal } from "./twod/AdminPortal.jsx";
import { LoaderIntro } from "./components/LoaderIntro.jsx";
import { Nav } from "./components/Nav.jsx";
import Scene3D from "./components/Scene3D.jsx";
import { ScrollExperience } from "./components/ScrollExperience.jsx";
import { SmoothScroll } from "./components/SmoothScroll.jsx";
import { profile } from "./data/profileData.js";
import { SiteContentProvider, useSiteContentData } from "./twod/SiteContentContext.jsx";
import { TwoDPortfolio } from "./twod/TwoDPortfolio.jsx";

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [hoveredScene, setHoveredScene] = useState(null);
  const [activeProject, setActiveProject] = useState("netravax");
  const activeScene = useActiveScene();
  const completeIntro = useCallback(() => setIntroComplete(true), []);

  useMotionValueEvent(scrollYProgress, "change", setScrollProgress);

  return (
    <div className={`webgl-portfolio ${introComplete ? "is-live" : "is-booting"}`} data-active-scene={activeScene}>
      <SmoothScroll />
      <Scene3D
        activeProject={activeProject}
        activeScene={activeScene}
        hoveredScene={hoveredScene}
        scrollProgress={scrollProgress}
        setActiveProject={setActiveProject}
        setHoveredScene={setHoveredScene}
        threeDContent={threeDContent}
      />

      <Nav activeScene={activeScene} onHoverScene={setHoveredScene} routeNodes={threeDContent.sections} />
      <AnimatePresence>
        {!introComplete ? <LoaderIntro onComplete={completeIntro} /> : null}
      </AnimatePresence>

      <ScrollExperience
        activeProject={activeProject}
        activeScene={activeScene}
        hero={threeDContent.hero}
        onHoverScene={setHoveredScene}
        profile={threeDContent.profile}
        routeNodes={threeDContent.sections}
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
