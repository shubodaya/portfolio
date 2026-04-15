import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { AdminPortal } from "./AdminPortal";
import { contact, sectionCopy, services } from "./data/siteData";
import { projectCategories } from "./data/projectCatalog";
import { ContactGlyph } from "./components/ContactGlyph";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = () => {
      if (location.hash) {
        const node = document.getElementById(location.hash.slice(1));
        if (node) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.requestAnimationFrame(scrollTarget);
  }, [location.pathname, location.hash]);

  return null;
}

function SectionLink({ sectionId, label, onClick }) {
  const location = useLocation();

  if (location.pathname === "/") {
    return (
      <a href={`#${sectionId}`} onClick={onClick}>
        {label}
      </a>
    );
  }

  return (
    <Link to={{ pathname: "/", hash: `#${sectionId}` }} onClick={onClick}>
      {label}
    </Link>
  );
}

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const sectionLinks = [
    { sectionId: "services", label: "Services" },
    { sectionId: "highlights", label: "Highlights" },
    { sectionId: "projects", label: "Projects" },
    { sectionId: "portfolio-system", label: "Sites" },
    { sectionId: "insights", label: "Insights" },
    { sectionId: "contact", label: "Contact" }
  ];

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-brand" to="/">
          <span className="site-brand__mark" aria-hidden="true">
            <img src="/assets/network-logo.png" alt="" />
          </span>
          <span className="site-brand__copy">
            <strong>{contact.name}</strong>
            <span>{contact.subtitle}</span>
          </span>
        </Link>

        <button
          className="site-header__menu"
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          {sectionLinks.map((item) => (
            <SectionLink
              key={item.sectionId}
              sectionId={item.sectionId}
              label={item.label}
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <NavLink
            className={({ isActive }) =>
              `site-nav__link site-nav__link--catalog ${isActive ? "is-active" : ""}`
            }
            to="/projects"
          >
            Catalog
          </NavLink>
          <a
            className="button button--small"
            href={contact.links.resume}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const reachLinks = [
    {
      href: `mailto:${contact.email}`,
      label: "Send email",
      kind: "email"
    },
    {
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      label: "Call phone",
      kind: "phone"
    },
    {
      href: contact.links.linkedin,
      label: "Open LinkedIn",
      kind: "linkedin"
    },
    {
      href: contact.links.github,
      label: "Open GitHub",
      kind: "github"
    },
    {
      href: contact.links.blog,
      label: "Open blog",
      kind: "blog"
    },
    {
      href: contact.links.resume,
      label: "Open resume",
      kind: "resume"
    }
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__block">
          <p className="eyebrow">{sectionCopy.footer.eyebrow}</p>
          <h2>{contact.name}</h2>
          <p className="site-footer__summary">{contact.summary}</p>
        </div>

        <div className="site-footer__block">
          <h3>{sectionCopy.footer.servicesTitle}</h3>
          <ul className="footer-list">
            {services.map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div className="site-footer__block">
          <h3>{sectionCopy.footer.categoriesTitle}</h3>
          <ul className="footer-list">
            {projectCategories.slice(1).map((category) => (
              <li key={category}>
                <Link to={`/projects?category=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__block">
          <h3>{sectionCopy.footer.reachTitle}</h3>
          <div className="footer-icon-row" aria-label="Footer contact links">
            {reachLinks.map((item) => (
              <a
                className="footer-icon"
                href={item.href}
                key={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
                title={item.label}
              >
                <ContactGlyph kind={item.kind} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>{new Date().getFullYear()} {contact.name}</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";

  return (
    <div className="site-shell">
      {isAdminRoute ? null : <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {isAdminRoute ? null : <Footer />}
      {isAdminRoute ? null : (
        <Link
          className="admin-stealth-entry"
          to="/admin"
          aria-label="Owner admin login"
          title="Owner login"
        >
          A
        </Link>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AppShell />
    </BrowserRouter>
  );
}
