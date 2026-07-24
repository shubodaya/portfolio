import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "../data/profileData.js";
import { defaultThreeDContent } from "../data/threeDContent.js";
import { useMagneticPull } from "./useMagneticPull.js";

// Invites the first scroll: a packet pulsing down a short fibre line.
// Entrance is CSS (staged off .is-live); the fade-out on first scroll is a
// motion value, so it costs no re-renders.
function ScrollCue() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.025], [1, 0]);

  return (
    <div className="scroll-cue" aria-hidden="true">
      <motion.div className="scroll-cue__inner" style={{ opacity }}>
        <span className="scroll-cue__label">Scroll</span>
        <span className="scroll-cue__track">
          <i className="scroll-cue__packet" />
        </span>
      </motion.div>
    </div>
  );
}

export function Hero({ hero = defaultThreeDContent.hero, profile: profileContent = profile }) {
  const titleLines = Array.isArray(hero.titleLines) && hero.titleLines.length > 0 ? hero.titleLines : defaultThreeDContent.hero.titleLines;
  const magneticRef = useMagneticPull();

  return (
    <section className="hero-overlay" data-scene-section id="hero">
      <ScrollCue />
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
          <Link ref={magneticRef} to="/about">
            {hero.aboutLabel ?? "About"} <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/experience">
            {hero.experienceLabel ?? "Experience"} <ShieldCheck size={18} aria-hidden="true" />
          </Link>
          <Link to="/projects">
            {hero.projectsLabel} <ShieldCheck size={18} aria-hidden="true" />
          </Link>
          <Link to="/contact">
            {hero.contactLabel} <Mail size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
