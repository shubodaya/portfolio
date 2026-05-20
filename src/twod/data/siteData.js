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
      eyebrow: "Network Security | IT Infrastructure & Security",
      title: "Network Security Engineer",
      lead:
        "I protect businesses from network failures, security gaps, and downtime. Hands-on firewall management, VPN support, incident response, and smart automation."
    },
    overview: {
      eyebrow: "What this page shows",
      title:
        "I help organisations build secure, resilient networks. Firewall troubleshooting, VPN fault isolation, endpoint protection, cloud identity, and incident documentation that gets reused.",
      body: ""
    },
    highlights: {
      eyebrow: "Support and operations",
      title:
        "Practical network and IT support for businesses that need fast, reliable resolution of connectivity, security, and infrastructure problems.",
      body: ""
    },
    projects: {
      eyebrow: "Projects",
      title: "Network Security Focus Areas",
      body:
        "Selected labs and project work that support network security, infrastructure troubleshooting, defensive monitoring, and practical IT operations."
    },
    portfolio: {
      eyebrow: "Role pages",
      title:
        "Dedicated pages for each service area. The same experience presented through network support, security operations, and IT support.",
      body: ""
    },
    insights: {
      eyebrow: "Notes and references",
      title:
        "Written work that shows how I think. Troubleshooting decisions, security reasoning, and operational follow-up, alongside references from people I have worked with directly.",
      body: ""
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to support your network and security operations.",
      body:
        "If you need someone who can hit the ground running on firewall issues, VPN faults, incidents, or IT support, with clear documentation and service ownership from day one, get in touch."
    },
    catalog: {
      eyebrow: "Skills & Catalog",
      title: "Network, security, support, and research projects.",
      body:
        "This page collects technical labs, network-security work, support projects, research, and selected automation examples behind the landing page."
    },
    catalogCta: {
      eyebrow: "Next move",
      title: "Ready to discuss the right support path?",
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
    subtitle: "Network Security Engineer | IT Infrastructure & Security",
    location: "Remote & On-Site | UK-Based",
    availability: "Available for network security, IT infrastructure, and technical support engagements",
    email: "contact@shubodaya.dev",
    phone: "+44 7436301739",
    summary:
      "Network Security Engineer helping businesses stay secure and connected. Firewall management, VPN support, incident response, endpoint protection, and IT operations that are properly documented and repeatable.",
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
      value: "3+ Years",
      label: "Network, Firewall & IT Support Experience"
    },
    {
      value: "1,800+",
      label: "Critical Incidents Handled Annually"
    },
    {
      value: "25+",
      label: "UK On-Site & Remote Resolutions"
    },
    {
      value: "6+ Certifications",
      label: "Networking, Cloud & Security"
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
      title: "Network & Connectivity",
      description:
        "When connectivity breaks, business stops. I diagnose and resolve routing, switching, firewall, VPN, DNS, and DHCP issues quickly. Clear handover notes ensure nothing gets lost between shifts or teams.",
      metric: "25+ on-site and remote incidents resolved across live customer environments",
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
      title: "Incident Response & Monitoring",
      description:
        "I turn noisy alerts and fragmented logs into clear incident timelines. I handle firewall, VPN, SD-WAN, and routing cases from first alert to documented closure, with SLA and service restoration always front of mind.",
      metric: "From P1-P3 SonicWall cases to Microsoft Sentinel labs and traffic analysis",
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
      title: "Endpoint & Security Operations",
      description:
        "I support defensive security operations. From endpoint hardening and Sentinel-based threat detection to WAF validation and suspicious authentication analysis, with documentation that separates symptoms, root cause, and remediation clearly.",
      metric: "Endpoint hardening, Sentinel-based detection, and security investigation workflows",
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
      title: "Cloud, Identity & Automation",
      description:
        "I integrate Microsoft 365, Entra ID, and Azure fundamentals into day-to-day IT operations. PowerShell and Python automate diagnostics, reduce manual effort, and keep support documentation accurate and reusable.",
      metric: "Microsoft 365, Entra ID, Azure, and automation that reduces manual support effort",
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
      title: "Firewall, VPN & Network Troubleshooting",
      description:
        "Hands-on support for firewall policy, VPN access, routing, and switching issues in live customer environments with minimal downtime.",
      deliverables: [
        "Firewall rule, NAT, ACL, and HA checks",
        "Remote-access and site-to-site VPN support",
        "Routing, switching, LAN, WAN, and Wi-Fi troubleshooting"
      ]
    },
    {
      title: "Monitoring, Incidents & SLA Support",
      description:
        "Structured triage from first alert to closure, covering escalations, log review, and post-incident documentation within SLA targets.",
      deliverables: [
        "Log review and incident notes",
        "P1-P3 case handling and escalation support",
        "Service restoration and closure documentation"
      ]
    },
    {
      title: "Endpoint & Security Operations",
      description:
        "Defensive security support across endpoint hardening, SIEM visibility, and practical remediation with clear notes on root cause and next steps.",
      deliverables: [
        "Microsoft Sentinel and KQL lab work",
        "Endpoint protection and hardening awareness",
        "OWASP, WAF, and control-validation notes"
      ]
    },
    {
      title: "Microsoft 365, Entra ID & Azure",
      description:
        "Practical Microsoft cloud and identity support covering user access, secure configuration, and least-privilege principles in real IT environments.",
      deliverables: [
        "Microsoft 365 support fundamentals",
        "Entra ID users, groups, and access basics",
        "Azure and cloud-security lab practice"
      ]
    },
    {
      title: "Documentation & Automation",
      description:
        "Scripts, checklists, and knowledge-base articles that make support faster, more consistent, and easier for any engineer to pick up.",
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
      metric: "25+ Incidents Resolved",
      detail:
        "Delivered live on-site and remote support across customer environments. Clean change records, fast resolutions, and clear customer-facing documentation throughout.",
      tags: ["Routing and switching", "Firewall changes", "VPN restoration"]
    },
    {
      title: "SonicWall",
      metric: "1,800+ Cases Per Year",
      detail:
        "Handled P1 to P3 incidents across firewall, VPN, SD-WAN, HA, and routing in a 24x7 enterprise support environment, with escalation ownership and knowledge-article contributions.",
      tags: ["Enterprise support", "Escalations", "Knowledge articles"]
    },
    {
      title: "NCSC-Certified Degree",
      metric: "Distinction, MSc Cybersecurity",
      detail:
        "Completed an NCSC-certified MSc in Cybersecurity covering network security, cloud risk, defensive operations, and hands-on lab research. Graduated with Distinction.",
      tags: ["Threat modeling", "OWASP", "Risk and governance"]
    },
    {
      title: "CCNA · Network+ · Security+ · AZ-900 · ISC2 CC · Google IT Automation",
      metric: "6+ Industry Certifications",
      detail:
        "A credential set built to support practical work covering networking, cloud fundamentals, security, and IT automation.",
      tags: ["Networking", "Cloud", "Security"]
    }
  ],
  hiringReasons: [
    {
      title: "Operational Networking",
      description:
        "The strongest signal is practical infrastructure support. Connectivity, firewall and VPN cases, monitoring, escalation, and service restoration in live customer environments.",
      items: [
        "TCP/IP, LAN/Wi-Fi, DNS, DHCP, routing, and switching",
        "Firewall, VPN, SD-WAN, HA, NAT, and ACL support",
        "Customer-facing incident handling in support environments"
      ]
    },
    {
      title: "Security-Aware Support",
      description:
        "The security work enables better defensive operations. Cleaner triage, practical endpoint hardening, and packet-led remediation informed by real threat analysis.",
      items: [
        "Microsoft Sentinel and network traffic analysis labs",
        "Endpoint protection and secure-access awareness",
        "Threat modeling, OWASP, WAF, and remediation notes"
      ]
    },
    {
      title: "Clear Documentation Under Pressure",
      description:
        "Support work only closes well when the fix, impact, and next steps are clear to users, engineers, and service teams. Every time, not just when things go smoothly.",
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
