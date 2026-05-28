import { Hero } from "./Hero.jsx";
import { JourneyNetworkBackdrop } from "./JourneyNetworkBackdrop.jsx";
import { profile, routeNodes } from "../data/profileData.js";
import { ContactGlyph } from "../twod/components/ContactGlyph.jsx";

const footerSectionLinks = [
  { href: "/services", label: "Services" },
  { href: "/highlights", label: "Highlights" },
  { href: "/featured-projects", label: "Featured Projects" },
  { href: "/role-pages", label: "Role Pages" },
  { href: "/insights", label: "Insights" },
  { href: "/catalog", label: "Catalog" },
  { href: "/resume", label: "Resume" }
];

export function SceneSection({ align = "left", children, id, kicker, title }) {
  return (
    <section className={`story-section story-section--${align}`} data-scene-section id={id}>
      <div className="story-section__copy">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}

export function ScrollExperience({ hero, profile: profileContent = profile, routeNodes: nodes = routeNodes }) {
  const footerPrimaryLinks = [
    { href: "/", label: "Home" },
    ...nodes.map((node) => ({
      href: node.path || `/${node.id}`,
      label: node.label
    }))
  ];
  const outroLinks = [
    { label: "Email", href: `mailto:${profileContent.email}`, kind: "email" },
    { label: "LinkedIn", href: profileContent.links.linkedin, kind: "linkedin" },
    { label: "GitHub", href: profileContent.links.github, kind: "github" },
    { label: "Blog", href: profileContent.links.blog, kind: "blog" },
    { label: "Resume", href: profileContent.links.resume, kind: "resume" }
  ];

  return (
    <main className="scroll-experience">
      <Hero hero={hero} profile={profileContent} />
      {nodes.map((node, index) => (
        <SceneSection
          id={node.id}
          key={node.id}
          kicker={`${String(index + 1).padStart(2, "0")} / ${node.signal}`}
          title={node.label}
        >
          <p>{node.summary}</p>
        </SceneSection>
      ))}
      <section className="story-section story-section--outro" data-scene-section id="outro" aria-label="S outro">
        <JourneyNetworkBackdrop className="outro-journey-network" density={1} opacity={0.46} />
        <div className="outro-message">
          <p>Network security, infrastructure support, and technical troubleshooting.</p>
          <strong>{profileContent.email}</strong>
        </div>
        <nav className="outro-contact-panel" aria-label="Contact links">
          {outroLinks.map(({ href, kind, label }) => (
            <a
              aria-label={label}
              href={href}
              key={label}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              target={href.startsWith("http") ? "_blank" : undefined}
              title={label}
            >
              <ContactGlyph kind={kind} />
            </a>
          ))}
        </nav>
        <footer className="site-footer" aria-label="Website footer">
          <span className="site-footer__rule" aria-hidden="true" />
          <div className="site-footer__statement">
            <p>Behind every reliable business is a network someone carefully protects.</p>
            <span>Network security, infrastructure support, and practical troubleshooting.</span>
          </div>
          <div className="site-footer__links">
            <section>
              <h2>Portfolio</h2>
              <ul>
                {footerPrimaryLinks.map(({ href, label }) => (
                  <li key={`${href}-${label}`}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Sections</h2>
              <ul>
                {footerSectionLinks.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Connect</h2>
              <ul>
                <li>
                  <a href={`mailto:${profileContent.email}`}>Email</a>
                </li>
                <li>
                  <a href={profileContent.links.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
                </li>
                <li>
                  <a href={profileContent.links.github} rel="noreferrer" target="_blank">GitHub</a>
                </li>
                <li>
                  <a href={profileContent.links.blog} rel="noreferrer" target="_blank">Blog</a>
                </li>
              </ul>
            </section>
          </div>
          <div className="site-footer__bar">
            <span>Shubodaya Kumar</span>
            <span>Network Security Engineer</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
