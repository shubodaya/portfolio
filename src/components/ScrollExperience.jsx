import { Hero } from "./Hero.jsx";
import { profile, routeNodes } from "../data/profileData.js";
import { ContactGlyph } from "../twod/components/ContactGlyph.jsx";

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
      </section>
    </main>
  );
}
