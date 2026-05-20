import { profile, routeNodes } from "./profileData.js";

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const cloneThreeDContent = (value) => JSON.parse(JSON.stringify(value));

export const mergeThreeDContent = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? cloneThreeDContent(override) : cloneThreeDContent(base);
  }

  if (isRecord(base)) {
    const next = {};
    const overrideRecord = isRecord(override) ? override : {};

    Object.keys(base).forEach((key) => {
      next[key] = mergeThreeDContent(base[key], overrideRecord[key]);
    });

    Object.keys(overrideRecord).forEach((key) => {
      if (!(key in next)) {
        next[key] = cloneThreeDContent(overrideRecord[key]);
      }
    });

    return next;
  }

  return override === undefined ? base : override;
};

export const tileSectionIds = [
  "services",
  "highlights",
  "projects",
  "role-pages",
  "insights",
  "catalog",
  "resume",
  "contact"
];

export const defaultThreeDContent = {
  profile: cloneThreeDContent(profile),
  hero: {
    kicker: "FIREWALL / VPN / NETWORK TROUBLESHOOTING",
    titleLines: ["SHUBODAYA KUMAR", "NETWORK SECURITY ENGINEER"],
    body: "I help keep networks secure, connected, and reliable.",
    servicesLabel: "Services",
    projectsLabel: "Projects",
    contactLabel: "Contact Me",
    resumeLabel: "Download CV"
  },
  sections: routeNodes.map((node) => ({ ...node })),
  tiles: {
    services: {
      kicker: "01 / SERVICES",
      title: "SERVICES",
      body: "Hands-on network and security support across the full incident lifecycle.",
      icon: "/assets/portfolio/serverblue.png",
      image: "/assets/portfolio/serverblue.png",
      typography: { titleScale: 1.06, bodyScale: 1.18, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• Firewall policy, NAT, ACL, and VPN diagnostics",
        "• Routing, switching, LAN, Wi-Fi, DNS, DHCP",
        "• Packet captures, log review, escalation notes",
        "• Monitoring, SLA closure, and handover notes",
        "• Microsoft 365, Entra ID, Azure, support scripts"
      ]
    },
    highlights: {
      kicker: "02 / ABOUT",
      title: "ABOUT",
      body: "3 years of network, firewall, and IT support experience across enterprise and field environments.",
      icon: "/assets/portfolio/about-id-badge.png",
      image: "/assets/portfolio/story-security.png",
      typography: { titleScale: 1.08, bodyScale: 1.12, kickerScale: 1, lineHeightScale: 1.03 },
      lines: [
        "• SonicWall: P1 to P3 firewall, VPN, SD-WAN, HA, routing",
        "• Itarmi IT Services: on-site and remote support records",
        "• MSc Cybersecurity with Distinction from an NCSC-certified programme",
        "• CCNA, Network+, Security+, AZ-900, ISC2 CC, Google IT Automation"
      ]
    },
    projects: {
      kicker: "03 / PROJECTS",
      title: "PROJECTS",
      body: "Network security labs focused on diagnostics and visibility.",
      icon: "/assets/portfolio/netravax.png",
      image: "/assets/portfolio/netravax.png",
      typography: { titleScale: 1.08, bodyScale: 1.17, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• Netravax: packet captures, logs, diagnostics exports",
        "• Network Lab: routing, switching, DNS, DHCP, AD, VPN",
        "• Home SOC: Sentinel, KQL, authentication analysis",
        "• WAF, IDS, and automotive security research"
      ]
    },
    "role-pages": {
      kicker: "04 / ROLE PAGES",
      title: "ROLE PAGES",
      body: "Four dedicated pages presenting the same experience through different service lenses.",
      icon: "/assets/projects/site-network-browser.png",
      image: "/assets/projects/site-network-browser.png",
      typography: { titleScale: 1.04, bodyScale: 1.14, kickerScale: 1, lineHeightScale: 1.03 },
      lines: [
        "• Network Support Engineer: routing, switching, DNS, DHCP",
        "• Security Operations Engineer: firewall, Sentinel, monitoring",
        "• IT Support Engineer: Microsoft 365, Entra ID, device setup",
        "• Network Security Notes: lab notes and support decisions"
      ]
    },
    insights: {
      kicker: "05 / INSIGHTS",
      title: "INSIGHTS",
      body: "Technical writing that shows the reasoning behind support and security decisions.",
      icon: "/assets/projects/site-blog-browser.png",
      image: "/assets/projects/site-blog-browser.png",
      typography: { titleScale: 1.05, bodyScale: 1.16, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• Notes separate symptoms, logs, root cause, and follow-up",
        "• Diagnostics, monitoring, traffic analysis, automation",
        "• Net-Kit: one operator workspace for support notes",
        "• IDS write-up: traffic classification and model evaluation"
      ]
    },
    catalog: {
      kicker: "07 / SKILLS & CATALOG",
      title: "SKILLS & CATALOG",
      body: "Reference view for skills, labs, credentials, and education.",
      icon: "/assets/projects/site-security-browser.png",
      image: "/assets/projects/site-security-browser.png",
      typography: { titleScale: 1, bodyScale: 1.14, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• Firewall, VPN, networking, systems, cloud",
        "• Security tools, monitoring, scripting, automation",
        "• Labs across diagnostics, SOC, IDS, and research",
        "• Certifications and MSc Cybersecurity with Distinction"
      ]
    },
    resume: {
      kicker: "08 / RESUME",
      title: "RESUME",
      body: "Full CV covering role history, technical strengths, and certifications.",
      icon: "/assets/projects/hero-command.jpg",
      image: "/assets/projects/hero-command.jpg",
      typography: { titleScale: 1.1, bodyScale: 1.18, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• SonicWall: enterprise firewall, VPN, and routing support",
        "• Itarmi: field and remote support documentation",
        "• Firewall policy, packet capture, SLA, mentoring",
        "• Direct CV download link included"
      ]
    },
    contact: {
      kicker: "06 / CONTACT",
      title: "CONTACT",
      body: "Available for network security, IT support, and infrastructure support engagements.",
      icon: "/assets/favicon/apple-touch-icon.png",
      image: "/assets/portfolio/serverblue.png",
      typography: { titleScale: 1.06, bodyScale: 1.16, kickerScale: 1, lineHeightScale: 1.04 },
      lines: [
        "• Firewall, VPN, troubleshooting, incident response",
        "• Remote, hybrid, and on-site support",
        `• Email: ${profile.email}`,
        `• Phone: ${profile.phone}`,
        "• LinkedIn, GitHub, and portfolio links on contact page"
      ]
    }
  }
};

export const getMergedThreeDContent = (overrides) =>
  mergeThreeDContent(defaultThreeDContent, overrides);
