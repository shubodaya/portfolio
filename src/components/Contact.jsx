import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { profile } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

const links = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
  { label: "Blog", href: profile.links.blog },
  { label: "CV", href: profile.links.resume }
];

export function Contact() {
  return (
    <SceneSection align="right" id="contact" kicker="07 / Contact" title="Firewall, VPN, network troubleshooting, and IT support">
      <p>
        I help with reliable infrastructure work across firewalls, VPNs, LAN/Wi-Fi,
        Microsoft 365, identity, monitoring, and technical support documentation.
      </p>
      <div className="contact-facts">
        <span>
          <Mail size={16} aria-hidden="true" /> {profile.email}
        </span>
        <span>
          <Phone size={16} aria-hidden="true" /> {profile.phone}
        </span>
      </div>
      <div className="overlay-actions overlay-actions--compact">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <a href={link.href} key={link.label} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>
              {link.label} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </SceneSection>
  );
}
