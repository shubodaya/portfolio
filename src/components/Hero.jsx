import { ArrowDownRight, Download, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "../data/profileData.js";
import { defaultThreeDContent } from "../data/threeDContent.js";

export function Hero({ hero = defaultThreeDContent.hero, profile: profileContent = profile }) {
  const titleLines = Array.isArray(hero.titleLines) && hero.titleLines.length > 0 ? hero.titleLines : defaultThreeDContent.hero.titleLines;

  return (
    <section className="hero-overlay" data-scene-section id="hero">
      <div className="hero-overlay__copy">
        <p className="kicker">{hero.kicker}</p>
        <h1>
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p>{hero.body}</p>
        <p className="hero-supporting">{profileContent.subtitle}</p>
        <div className="overlay-actions">
          <Link to="/services">
            {hero.servicesLabel} <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/featured-projects">
            {hero.projectsLabel} <ShieldCheck size={18} aria-hidden="true" />
          </Link>
          <Link to="/contact">
            {hero.contactLabel} <Mail size={18} aria-hidden="true" />
          </Link>
          <a href={profileContent.links.resume} rel="noreferrer" target="_blank">
            {hero.resumeLabel} <Download size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
