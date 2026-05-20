import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { routeNodes } from "../data/profileData.js";

export function Nav({ activeScene, onHoverScene }) {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(".is-active");

    if (!activeLink || !window.matchMedia("(max-width: 720px)").matches) return;

    activeLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeScene]);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeScene]);

  const handleSceneClick = (event, sceneId) => {
    const target = document.getElementById(sceneId);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sceneId}`);
    setMenuOpen(false);
  };

  return (
    <header className={`command-nav ${menuOpen ? "is-open" : "is-collapsed"}`}>
      <Link className="nav-mark" to="/" aria-label="Return to home" onClick={() => setMenuOpen(false)}>
        <span>S</span>
      </Link>
      <nav aria-label="Portfolio route" id="portfolio-mobile-nav" ref={navRef}>
        {routeNodes.map((node) => {
          const commonProps = {
            onBlur: () => onHoverScene?.(null),
            onFocus: () => onHoverScene?.(node.id),
            onMouseEnter: () => onHoverScene?.(node.id),
            onMouseLeave: () => onHoverScene?.(null)
          };

          return (
            <a
              {...commonProps}
              className={activeScene === node.id ? "is-active" : ""}
              href={`#${node.id}`}
              key={node.id}
              onClick={(event) => handleSceneClick(event, node.id)}
            >
              <span>{node.short}</span>
              <b>{node.label}</b>
            </a>
          );
        })}
      </nav>
      <button
        aria-controls="portfolio-mobile-nav"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        className="nav-toggle"
        onClick={() => setMenuOpen((current) => !current)}
        type="button"
      >
        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
    </header>
  );
}
