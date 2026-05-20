import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ContactGlyph } from "./components/ContactGlyph";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SiteContentProvider, useSiteContentData } from "./SiteContentContext";
import "./styles.css";

const sectionLinks = [
  { sectionId: "services", label: "Services", route: "/services" },
  { sectionId: "highlights", label: "About", route: "/highlights" },
  { sectionId: "projects", label: "Projects", route: "/featured-projects" },
  { sectionId: "portfolio-system", label: "Role Pages", route: "/role-pages" },
  { sectionId: "insights", label: "Insights", route: "/insights" },
  { sectionId: "contact", label: "Contact", route: "/contact" }
];

const routeToSection = new Map(sectionLinks.map((item) => [item.route, item.sectionId]));

function ScrollToSection({ sectionId }) {
  const location = useLocation();

  useEffect(() => {
    const scrollNow = () => {
      if (!sectionId) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      const node = document.getElementById(sectionId);
      if (node) {
        const headerOffset = 88;
        const top = node.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, left: 0, behavior: "auto" });
      }
    };

    scrollNow();
    const first = window.setTimeout(scrollNow, 80);
    const second = window.setTimeout(scrollNow, 260);
    const third = window.setTimeout(scrollNow, 720);
    const fourth = window.setTimeout(scrollNow, 1400);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
      window.clearTimeout(third);
      window.clearTimeout(fourth);
    };
  }, [location.pathname, location.search, sectionId]);

  return null;
}

function Header() {
  const location = useLocation();
  const { siteContent } = useSiteContentData();
  const { contact } = siteContent;
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
  }, [location.pathname, location.search]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-brand" to="/">
          <span className="site-brand__mark" aria-hidden="true">
            <img src="/assets/favicon/apple-touch-icon.png" alt="" />
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
            <NavLink
              className={({ isActive }) =>
                isActive || routeToSection.get(location.pathname) === item.sectionId ? "is-active" : undefined
              }
              key={item.sectionId}
              to={item.route}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) =>
              `site-nav__link site-nav__link--catalog ${isActive || location.pathname === "/projects" ? "is-active" : ""}`
            }
            to="/catalog"
          >
            Skills & Catalog
          </NavLink>
          <a className="button button--small" href={contact.links.resume} rel="noreferrer" target="_blank">
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { siteContent, projectCategories } = useSiteContentData();
  const { contact, sectionCopy, services } = siteContent;
  const footerCategories = projectCategories.filter((category) =>
    ["Network Security", "Pentesting", "Research and Systems", "Portfolio Systems"].includes(category)
  );
  const reachLinks = [
    {
      href: `mailto:${contact.email}`,
      label: "Send email",
      shortLabel: "Email",
      kind: "email"
    },
    {
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      label: "Call phone",
      shortLabel: "Call",
      kind: "phone"
    },
    {
      href: contact.links.linkedin,
      label: "Open LinkedIn",
      shortLabel: "LinkedIn",
      kind: "linkedin"
    },
    {
      href: contact.links.github,
      label: "Open GitHub",
      shortLabel: "GitHub",
      kind: "github"
    },
    {
      href: contact.links.blog,
      label: "Open blog",
      shortLabel: "Blog",
      kind: "blog"
    },
    {
      href: contact.links.resume,
      label: "Open resume",
      shortLabel: "Resume",
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
            {footerCategories.map((category) => (
              <li key={category}>
                <Link to={`/catalog?category=${encodeURIComponent(category)}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__block">
          <h3>{sectionCopy.footer.reachTitle}</h3>
          <div className="footer-link-row" aria-label="Footer contact links">
            {reachLinks.map((item) => (
              <a
                className="footer-link"
                href={item.href}
                key={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
                title={item.label}
              >
                <span className="footer-link__icon" aria-hidden="true">
                  <ContactGlyph kind={item.kind} />
                </span>
                <span className="footer-link__label">{item.shortLabel}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>
          {new Date().getFullYear()} {contact.name}
        </span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

function ResumePage() {
  const { siteContent } = useSiteContentData();
  const { contact } = siteContent;

  return (
    <section className="section section--projects-page" id="top">
      <div className="page-hero" data-reveal>
        <p className="eyebrow">Resume</p>
        <h1>{contact.title}</h1>
        <p>{contact.summary}</p>
        <div className="hero__availability hero__availability--page">
          <span>{contact.email}</span>
          <span>{contact.phone}</span>
          <span>{contact.availability}</span>
        </div>
        <div className="contact-cta__actions">
          <a className="button" href={contact.links.resume} target="_blank" rel="noreferrer">
            Open full CV
          </a>
          <Link className="button button--secondary" to="/catalog">
            View skills & catalog
          </Link>
        </div>
      </div>
    </section>
  );
}

function TwoDContent({ mode, sectionId }) {
  return (
    <div className="twod-clone">
      <div className="site-shell">
        <Header />
        <main>
          <ScrollToSection sectionId={sectionId} />
          {mode === "catalog" ? <ProjectsPage /> : mode === "resume" ? <ResumePage /> : <HomePage />}
        </main>
        <Footer />
        <Link className="admin-stealth-entry" to="/admin" aria-label="Owner admin login" title="Owner login">
          a
        </Link>
      </div>
    </div>
  );
}

export function TwoDPortfolio({ mode = "home", sectionId = null }) {
  return (
    <SiteContentProvider>
      <TwoDContent mode={mode} sectionId={sectionId} />
    </SiteContentProvider>
  );
}
