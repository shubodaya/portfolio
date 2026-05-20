import { ArrowDownRight, Download, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "../data/profileData.js";

export function Hero() {
  return (
    <section className="hero-overlay" data-scene-section id="hero">
      <div className="hero-overlay__copy">
        <p className="kicker">FIREWALL / VPN / NETWORK TROUBLESHOOTING</p>
        <h1>
          <span>SHUBODAYA KUMAR</span>
          <span>NETWORK SECURITY ENGINEER</span>
        </h1>
        <p>I help keep networks secure, connected, and reliable.</p>
        <p className="hero-supporting">{profile.subtitle}</p>
        <div className="overlay-actions">
          <Link to="/services">
            Services <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/featured-projects">
            Projects <ShieldCheck size={18} aria-hidden="true" />
          </Link>
          <Link to="/contact">
            Contact Me <Mail size={18} aria-hidden="true" />
          </Link>
          <a href={profile.links.resume} rel="noreferrer" target="_blank">
            Download CV <Download size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
