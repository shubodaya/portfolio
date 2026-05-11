const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const cloneSiteContent = (value) => JSON.parse(JSON.stringify(value));

export const mergeSiteContent = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? cloneSiteContent(override) : cloneSiteContent(base);
  }

  if (isRecord(base)) {
    const next = {};
    const overrideRecord = isRecord(override) ? override : {};

    Object.keys(base).forEach((key) => {
      next[key] = mergeSiteContent(base[key], overrideRecord[key]);
    });

    Object.keys(overrideRecord).forEach((key) => {
      if (!(key in next)) {
        next[key] = cloneSiteContent(overrideRecord[key]);
      }
    });

    return next;
  }

  return override === undefined ? base : override;
};

export const defaultSiteContent = {
  sectionCopy: {
    brand: {
      eyebrow: "Portfolio"
    },
    hero: {
      eyebrow: "Network Security / IT Network Support",
      title: "Network Security Engineer",
      lead:
        "I help keep networks, users, and systems secure, connected, and reliable through troubleshooting, monitoring, firewall/VPN support, and practical automation."
    },
    overview: {
      eyebrow: "What this page shows",
      title: "Network Security Engineer focused on secure, reliable infrastructure.",
      body:
        "My work is centred on firewall troubleshooting, VPN support, LAN and Wi-Fi connectivity, TCP/IP fundamentals, DNS/DHCP, monitoring, incident resolution, endpoint protection, and clear support documentation."
    },
    highlights: {
      eyebrow: "Support and operations",
      title: "Network and IT support capabilities.",
      body:
        "The focus is practical operational support: restore service, reduce risk, document the fix, and keep users and systems working within SLA expectations."
    },
    projects: {
      eyebrow: "Featured evidence",
      title: "Network Security Focus Areas",
      body:
        "Selected labs and case-study work that support network security, infrastructure troubleshooting, defensive monitoring, and practical IT operations."
    },
    portfolio: {
      eyebrow: "Role evidence",
      title: "Focused pages for network, security, and IT support roles.",
      body:
        "These pages keep the same evidence focused on the roles I am targeting: network operations, defensive security, and service-oriented IT support."
    },
    insights: {
      eyebrow: "Notes and references",
      title: "Writing that explains security and support decisions.",
      body:
        "The written work shows how I reason through troubleshooting, visibility, hardening, and operational follow-up, while references show how I work under support pressure."
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to support secure, reliable infrastructure.",
      body:
        "I am looking for UK network security, IT network support, and infrastructure support roles where clear troubleshooting, documentation, and service ownership matter."
    },
    catalog: {
      eyebrow: "Evidence catalog",
      title: "Network, security, support, and research evidence.",
      body:
        "This page collects the technical labs, network-security work, support evidence, research projects, and selected automation examples behind the landing page."
    },
    catalogCta: {
      eyebrow: "Next move",
      title: "Ready to connect the evidence back to a network or IT support role?",
      body:
        "The landing page gives the focused version. The catalog backs it up with labs, notes, and supporting technical work."
    },
    footer: {
      eyebrow: "Portfolio",
      servicesTitle: "Services",
      categoriesTitle: "Role-aligned areas",
      reachTitle: "Reach"
    }
  },
  contact: {
    name: "Shubodaya Kumar",
    title: "Network Security Engineer",
    subtitle: "Network Security Engineer / IT Network Support",
    location: "Plymouth, England",
    availability: "Open to entry-level and junior Network Security Engineer / IT Network Support roles in the UK",
    email: "contact@shubodaya.dev",
    phone: "+44 7436301739",
    summary:
      "I support secure, reliable infrastructure across firewalls, VPNs, LAN/Wi-Fi, DNS/DHCP, monitoring, Microsoft 365, Entra ID, Azure basics, endpoint protection, and IT operations documentation.",
    links: {
      resume:
        "https://docs.google.com/document/d/1_7zbqMzdl_wmW-mcFGJstg1HRwJrlj0dzo48k6ReFBg/edit?usp=sharing",
      linkedin: "https://www.linkedin.com/in/shubodaya/",
      github: "https://github.com/shubodaya",
      blog: "https://blog.shubodaya.dev/",
      youtube: "https://www.youtube.com/@KumarsNetLab"
    }
  },
  heroStats: [
    {
      value: "3+ years",
      label: "network, firewall, and IT support experience"
    },
    {
      value: "1,800+",
      label: "annual P1-P3 firewall, VPN, SD-WAN, HA, and routing cases"
    },
    {
      value: "25+",
      label: "UK on-site and remote support incidents resolved"
    },
    {
      value: "6+ certs",
      label: "networking, cloud, and security credentials"
    }
  ],
  keywordMarquee: [
    "Network engineering",
    "Firewall troubleshooting",
    "VPN support",
    "LAN and Wi-Fi",
    "TCP/IP",
    "DNS and DHCP",
    "Network monitoring",
    "Incident ownership",
    "SLA support",
    "Endpoint protection",
    "Microsoft 365",
    "Entra ID",
    "Azure fundamentals",
    "Operational automation",
    "Documentation"
  ],
  storyTracks: [
    {
      id: "networks",
      eyebrow: "Track 01",
      title: "Secure, reliable connectivity",
      description:
        "I work through routing, switching, LAN/Wi-Fi, firewall, VPN, TCP/IP, DNS, and DHCP issues with a support mindset built around uptime and user impact.",
      metric: "25+ on-site and remote incidents resolved in current UK support work",
      image: "/assets/01_Infrastructure_that_202604132237.png",
      alt: "Infrastructure-focused visual for resilient network and platform delivery.",
      outcomes: [
        "Routing, switching, LAN, WAN, and Wi-Fi troubleshooting",
        "Firewall policy, NAT, ACL, and access-control support",
        "VPN fault isolation and restoration checks",
        "DNS, DHCP, and core service validation",
        "Clear handover notes after incidents and change windows"
      ]
    },
    {
      id: "security",
      eyebrow: "Track 02",
      title: "Monitoring and incident resolution",
      description:
        "I connect alerts, logs, packet evidence, and user reports into practical triage so incidents can be understood, escalated, documented, and closed properly.",
      metric: "From SonicWall cases to Sentinel labs and network intrusion-detection research",
      image: "/assets/02_Security_work_202604142136.png",
      alt: "Security-focused visual for threat validation, defense, and telemetry work.",
      outcomes: [
        "Firewall, VPN, SD-WAN, HA, and routing case handling",
        "Network monitoring, log review, and escalation support",
        "Microsoft Sentinel and traffic-analysis lab practice",
        "Incident notes written for follow-up and knowledge reuse",
        "Troubleshooting shaped by SLA and service-restoration priorities"
      ]
    },
    {
      id: "tooling",
      eyebrow: "Track 03",
      title: "Security tools and endpoint protection",
      description:
        "I use security tooling to support defensive operations, from endpoint protection and hardening checks to visibility across authentication, traffic, and suspicious behaviour.",
      metric: "Hands-on work across defensive labs, endpoint controls, and security investigation workflows",
      image: "/assets/03_Products_that_202604142137.png",
      alt: "Security tooling visual for endpoint protection, monitoring, and defensive workflows.",
      outcomes: [
        "Endpoint security and basic hardening awareness",
        "Microsoft Sentinel, KQL, and suspicious-authentication analysis",
        "OWASP and WAF validation from a defensive perspective",
        "Threat-model and risk-analysis practice from MSc work",
        "Security notes that separate symptoms, root cause, and remediation"
      ]
    },
    {
      id: "delivery",
      eyebrow: "Track 04",
      title: "Identity, cloud, and support automation",
      description:
        "I use Microsoft 365, Entra ID, Azure fundamentals, and small scripts as part of IT operations support, not as a separate career direction.",
      metric: "From KB articles and support escalations to practical PowerShell, Python, and Azure lab work",
      image: "/assets/04_Communication_that_202604152253.png",
      alt: "Communication-focused visual for delivery, documentation, and stakeholder clarity.",
      outcomes: [
        "Microsoft 365 and Entra ID support fundamentals",
        "Azure basics, Sentinel labs, and cloud-security awareness",
        "PowerShell and Python used for diagnostics and support tasks",
        "Knowledge-base writing and incident documentation",
        "User and system troubleshooting with clear next-step communication"
      ]
    }
  ],
  services: [
    {
      title: "Firewall, VPN, and network troubleshooting",
      description:
        "Operational support for connectivity, firewall policy, VPN access, routing, and switching issues in real customer environments.",
      deliverables: [
        "Firewall rule, NAT, ACL, and HA checks",
        "Remote-access and site-to-site VPN support",
        "Routing, switching, LAN, WAN, and Wi-Fi troubleshooting"
      ]
    },
    {
      title: "Monitoring, incidents, and SLA support",
      description:
        "Structured triage for alerts, user reports, service-impacting issues, escalations, and post-incident follow-up.",
      deliverables: [
        "Log review and incident notes",
        "P1-P3 case handling and escalation support",
        "Service restoration and closure documentation"
      ]
    },
    {
      title: "Security tools and endpoint protection",
      description:
        "Defensive security support across endpoint controls, SIEM visibility, hardening checks, and practical remediation evidence.",
      deliverables: [
        "Microsoft Sentinel and KQL lab work",
        "Endpoint protection and hardening awareness",
        "OWASP, WAF, and control-validation notes"
      ]
    },
    {
      title: "Microsoft 365, Entra ID, and Azure basics",
      description:
        "IT support knowledge across common Microsoft cloud and identity tasks, with awareness of least privilege and secure access.",
      deliverables: [
        "Microsoft 365 support fundamentals",
        "Entra ID users, groups, and access basics",
        "Azure and cloud-security lab practice"
      ]
    },
    {
      title: "Documentation and IT operations automation",
      description:
        "Small scripts and repeatable notes used to speed up diagnostics, reduce manual effort, and make fixes easier to repeat.",
      deliverables: [
        "PowerShell and Python support scripts",
        "Diagnostic checklists and knowledge-base articles",
        "User and system troubleshooting notes"
      ]
    }
  ],
  proofPoints: [
    {
      title: "Itarmi IT Services",
      metric: "25+ incidents",
      detail:
        "Resolved live on-site and remote support issues across UK customer environments, with clean change records and customer-facing documentation.",
      tags: ["Routing and switching", "Firewall changes", "VPN restoration"]
    },
    {
      title: "SonicWall",
      metric: "1,800+ cases each year",
      detail:
        "Handled P1 to P3 incidents across firewall, VPN, SD-WAN, HA, and routing scenarios in a 24x7 support environment.",
      tags: ["Enterprise support", "Escalations", "Knowledge articles"]
    },
    {
      title: "MSc Cybersecurity",
      metric: "Distinction",
      detail:
        "Completed an NCSC-certified MSc focused on network, cloud, risk, and defensive security with hands-on labs and research.",
      tags: ["Threat modeling", "OWASP", "Risk and governance"]
    },
    {
      title: "Certifications",
      metric: "CCNA to Security+",
      detail:
        "Built a credential set that supports the practical work: CCNA, Network+, Security+, AZ-900, Google IT Automation, and ISC2 CC.",
      tags: ["Networking", "Cloud", "Security"]
    }
  ],
  hiringReasons: [
    {
      title: "Operational networking base",
      description:
        "The strongest signal is practical infrastructure support: connectivity, firewall/VPN cases, monitoring, escalation, and service restoration.",
      items: [
        "TCP/IP, LAN/Wi-Fi, DNS, DHCP, routing, and switching",
        "Firewall, VPN, SD-WAN, HA, NAT, and ACL support",
        "Customer-facing incident handling in UK support environments"
      ]
    },
    {
      title: "Security mindset in support work",
      description:
        "The security work supports defensive operations: better visibility, cleaner triage, practical hardening, and evidence-led remediation.",
      items: [
        "Microsoft Sentinel and network traffic analysis labs",
        "Endpoint protection and secure-access awareness",
        "Threat modeling, OWASP, WAF, and remediation notes"
      ]
    },
    {
      title: "Clear documentation under pressure",
      description:
        "Support work only closes properly when the fix, impact, evidence, and next step are clear to users, engineers, and service teams.",
      items: [
        "Concise technical updates under pressure",
        "Documentation that others can pick up quickly",
        "SLA-aware closure notes and knowledge-base writing"
      ]
    }
  ],
  blogNotes: [
    {
      title: "Net-Kit: A Unified Network and Security Utility Toolkit",
      category: "Network Security",
      summary:
        "Why one operator-focused workspace can remove friction from diagnostics, monitoring, and security-aware troubleshooting.",
      link: "https://shubodh-portfolio-blog.pages.dev/post/net-kit-a-unified-network-security-utility-toolkit/",
      linkLabel: "Read article"
    },
    {
      title: "Network Intrusion Detection with Machine Learning",
      category: "Security Analytics",
      summary:
        "A practical walkthrough of how traffic classification and model evaluation can support real network-security analysis.",
      link: "https://shubodh-portfolio-blog.pages.dev/post/network-intrusion-detection-with-machine-learning/",
      linkLabel: "Read article"
    },
    {
      title: "Field notes across networking, cybersecurity, and automation",
      category: "Technical Writing",
      summary:
        "Notes on troubleshooting, secure access, monitoring, and operations automation used to make support work clearer and more repeatable.",
      link: "https://blog.shubodaya.dev/",
      linkLabel: "Browse blog"
    }
  ],
  testimonials: [
    {
      quote:
        "Shubodaya consistently delivered high-quality support, maintained strong KPIs, and brought a disciplined, collaborative attitude to complex technical work.",
      name: "Manoteja Manem",
      role: "Manager, Technical Support"
    },
    {
      quote:
        "A quick learner who adapts fast, works methodically, and shows strong professionalism with stakeholders and peers alike.",
      name: "Mallesh Tadimari",
      role: "Senior Manager, Technical Support"
    },
    {
      quote:
        "He asks thoughtful questions, learns beyond coursework, and works independently with strong curiosity and discipline.",
      name: "Praveena K S",
      role: "Lecturer and Cisco Certified Trainer"
    }
  ]
};

export const getMergedSiteContent = (overrides) =>
  mergeSiteContent(defaultSiteContent, overrides);
