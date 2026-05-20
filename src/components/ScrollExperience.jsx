import { Hero } from "./Hero.jsx";
import { profile, routeNodes } from "../data/profileData.js";
import { ContactGlyph } from "../twod/components/ContactGlyph.jsx";

const outroLinks = [
  { label: "Email", href: `mailto:${profile.email}`, kind: "email" },
  { label: "LinkedIn", href: profile.links.linkedin, kind: "linkedin" },
  { label: "GitHub", href: profile.links.github, kind: "github" },
  { label: "Blog", href: profile.links.blog, kind: "blog" },
  { label: "Resume", href: profile.links.resume, kind: "resume" }
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

export function ScrollExperience() {
  return (
    <main className="scroll-experience">
      <Hero />
      {routeNodes.map((node, index) => (
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
