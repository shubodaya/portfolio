const SITE_CONTENT_STORAGE_KEY = "portfolio-site-content-v1";

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
      eyebrow: "Portfolio / computer science professional",
      title: "Networks, security, products, and automation in one hiring story.",
      lead:
        "I move between live infrastructure, security validation, SaaS products, and technical tooling without losing the thread. The common signal is disciplined delivery: stable systems, evidence-led security work, and products that people can actually use."
    },
    overview: {
      eyebrow: "What this portfolio shows",
      title: "I bring infrastructure, security, and product delivery into one hire.",
      body:
        "I built this portfolio to show the range I can bring to a team without diluting technical depth. I can move from network operations to security validation, from web applications to automation, and still keep the work structured, accountable, and clear for the people relying on it."
    },
    highlights: {
      eyebrow: "Services and experience",
      title: "What teams can bring me in to do.",
      body:
        "The services are broad because the work already is. They still map cleanly to business outcomes: healthier systems, stronger validation, better tooling, and clearer delivery."
    },
    projects: {
      eyebrow: "Featured work",
      title: "Project categories that go deeper than one job title.",
      body:
        "The work moves from network-security labs to product platforms, portfolio systems, AI tooling, research, and interactive builds without breaking the same narrative."
    },
    portfolio: {
      eyebrow: "Portfolio sites",
      title: "Each portfolio site reframes the work for a different hiring conversation.",
      body:
        "The core body of work stays the same. What changes is the framing: network operations, cybersecurity, pentesting, IT delivery, technical publishing, and a more experimental 3D presentation."
    },
    insights: {
      eyebrow: "Notes and signals",
      title: "Writing and references that strengthen the portfolio.",
      body:
        "The project list matters, but so do the written explanations and the people who have already seen how I work under pressure."
    },
    contact: {
      eyebrow: "Contact",
      title: "Hire me for the work that needs range, discipline, and clarity.",
      body:
        "If you need someone who can move from packet captures to product workflows, from lab evidence to stakeholder explanation, this is the portfolio built to make that obvious."
    },
    catalog: {
      eyebrow: "Catalog",
      title: "All the work, grouped by discipline and type.",
      body:
        "This page is the wider project map behind the landing experience. It includes the technical labs, SaaS builds, role-focused portfolio sites, research projects, and application work that sit behind the portfolio."
    },
    catalogCta: {
      eyebrow: "Next move",
      title: "Ready to connect the portfolio back to a role, brief, or service need?",
      body:
        "The landing page is built to tell the story quickly. This catalog is built to back that story up with breadth."
    },
    footer: {
      eyebrow: "Portfolio",
      servicesTitle: "Services",
      categoriesTitle: "Project categories",
      reachTitle: "Reach"
    }
  },
  contact: {
    name: "Shubodaya Kumar",
    title: "Computer Science Professional",
    subtitle: "Network engineering, cybersecurity, software products, and automation",
    location: "Plymouth, England",
    availability: "Open to roles, consulting, and project collaborations",
    email: "hnshubodaya@gmail.com",
    phone: "+44 7436301739",
    summary:
      "I build and support systems across network engineering, cybersecurity, web products, automation, and technical storytelling so teams can ship, defend, and explain their environments with confidence.",
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
      label: "production support and engineering work"
    },
    {
      value: "28 projects",
      label: "labs, products, portfolio systems, and creative builds"
    },
    {
      value: "1,800+",
      label: "annual cases handled in high-volume support"
    },
    {
      value: "6+ certs",
      label: "networking, cloud, and security credentials"
    }
  ],
  keywordMarquee: [
    "Network engineering",
    "Firewall and VPN operations",
    "Pentesting labs",
    "Threat detection",
    "Azure and cloud labs",
    "React products",
    "Cloudflare platforms",
    "AI and automation",
    "Incident ownership",
    "Documentation and stakeholder delivery",
    "Portfolio systems",
    "Full-stack builds"
  ],
  storyTracks: [
    {
      id: "networks",
      eyebrow: "Track 01",
      title: "Infrastructure that stays dependable",
      description:
        "I work across routing, switching, firewalls, VPNs, and hybrid connectivity with the mindset that reliability is a feature, not a maintenance task.",
      metric: "25+ on-site and remote incidents resolved in current UK support work",
      image: "/assets/01_Infrastructure_that_202604132237.png",
      alt: "Infrastructure-focused visual for resilient network and platform delivery.",
      outcomes: [
        "Routing, switching, LAN and WAN troubleshooting",
        "Firewall policy, NAT, ACL, VPN, and access control changes",
        "Customer-ready handover notes after live incidents and change windows",
        "Operational monitoring and escalation workflows shaped around uptime",
        "Lab-backed validation for core services, segmentation, and recovery paths"
      ]
    },
    {
      id: "security",
      eyebrow: "Track 02",
      title: "Security work backed by evidence",
      description:
        "The security side of my portfolio is not theory-only. It connects attack validation, packet evidence, SIEM telemetry, and hardening decisions that defenders can act on.",
      metric: "From OWASP and WAF validation to Home SOC and intrusion-detection research",
      image: "/assets/02_Security_work_202604142136.png",
      alt: "Security-focused visual for threat validation, defense, and telemetry work.",
      outcomes: [
        "Pentesting, validation labs, and control effectiveness checks",
        "Microsoft Sentinel, traffic analysis, and threat-detection workflows",
        "Research grounded in ISO 21434, threat modeling, and remediation logic",
        "Security write-ups that explain exposure, visibility, and remediation clearly",
        "Defensive workflows that connect alerts, logs, and attack-path reasoning"
      ]
    },
    {
      id: "products",
      eyebrow: "Track 03",
      title: "Products that people can actually use",
      description:
        "Alongside infrastructure and security, I build product-grade interfaces, dashboards, workflows, and SaaS experiences across finance, scheduling, fitness, portfolio creation, and order management.",
      metric: "From expense analytics and scheduling platforms to portfolio builders and ordering systems",
      image: "/assets/03_Products_that_202604142137.png",
      alt: "Product-focused visual for application delivery, workflows, and platforms.",
      outcomes: [
        "React, Vite, Next.js, Tailwind, Cloudflare, and Firebase delivery",
        "Account flows, dashboards, multi-step tools, and admin workflows",
        "UI decisions shaped by clarity, state management, and real user journeys",
        "Marketplace, scheduling, finance, and builder workflows handled in one portfolio",
        "Live deployments that show product polish rather than concept-only prototypes"
      ]
    },
    {
      id: "delivery",
      eyebrow: "Track 04",
      title: "Communication that survives scrutiny",
      description:
        "My value is not just building the thing. It is explaining what changed, what matters, what failed, and what to do next in a way that recruiters, engineers, and clients can all follow.",
      metric: "From KB articles and support escalations to role-specific portfolio systems",
      image: "/assets/04_Communication_that_202604152253.png",
      alt: "Communication-focused visual for delivery, documentation, and stakeholder clarity.",
      outcomes: [
        "Knowledge-base writing and incident documentation",
        "Role-focused portfolio systems for different hiring conversations",
        "Clear translation between technical detail and business impact",
        "Technical posts that explain why a system or control matters",
        "Delivery updates shaped for engineers, hiring teams, and clients alike"
      ]
    }
  ],
  services: [
    {
      title: "Network engineering and escalation support",
      description:
        "Operational support for routing, switching, firewall, VPN, and access issues in real customer environments.",
      deliverables: [
        "LAN and WAN troubleshooting",
        "Routing, NAT, ACL, HA, and VPN changes",
        "Post-incident validation and handover"
      ]
    },
    {
      title: "Security testing and validation",
      description:
        "Labs and assessments that focus on exploitability, detection visibility, and the hardening path that follows.",
      deliverables: [
        "OWASP and WAF validation",
        "Threat detection and SIEM checks",
        "Research-led security architecture work"
      ]
    },
    {
      title: "Web application and SaaS delivery",
      description:
        "Product builds with authentication, dashboards, workflows, and clean information architecture.",
      deliverables: [
        "React and Next.js interfaces",
        "Cloudflare and Firebase-backed workflows",
        "Admin tools and production-ready UX"
      ]
    },
    {
      title: "Cloud, identity, and platform hardening",
      description:
        "Cloud-connected labs and service baselines shaped by least privilege, sensible segmentation, and observability.",
      deliverables: [
        "Azure and AWS lab setups",
        "Identity and access patterns",
        "Linux hardening and service reduction"
      ]
    },
    {
      title: "Automation and internal tooling",
      description:
        "Workflow acceleration through scripts, diagnostics, AI features, and operator-focused tool design.",
      deliverables: [
        "Python and PowerShell automation",
        "Diagnostic and log analysis tooling",
        "Voice-first and export-friendly interfaces"
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
        "Completed an NCSC-certified MSc focused on network, application, and cloud security with hands-on labs and research.",
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
      title: "Range without fragmentation",
      description:
        "The portfolio spans network operations, cybersecurity, software products, automation, and research, but it still tells one coherent story: technical depth that can move across layers.",
      items: [
        "Infrastructure, security, and software in one stack",
        "Comfortable with both incident pressure and product polish",
        "Able to switch context without losing rigor"
      ]
    },
    {
      title: "Evidence over vague claims",
      description:
        "The work is backed by case studies, write-ups, live products, and focused labs rather than broad claims with no artifacts behind them.",
      items: [
        "GitHub repositories and deployed products",
        "Blog posts and technical walkthroughs",
        "Operational and academic track record"
      ]
    },
    {
      title: "Clear with stakeholders",
      description:
        "I have spent enough time in customer and escalation work to know that strong communication is part of the engineering, not a soft add-on.",
      items: [
        "Concise technical updates under pressure",
        "Documentation that others can pick up quickly",
        "Delivery framed around outcomes, not only activity"
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
        "The writing side of the portfolio exists to show how the reasoning behind the work holds up when explained clearly.",
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

export const readStoredSiteContentOverrides = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const siteContent = getMergedSiteContent(readStoredSiteContentOverrides());

export const {
  sectionCopy,
  contact,
  heroStats,
  keywordMarquee,
  storyTracks,
  services,
  proofPoints,
  hiringReasons,
  blogNotes,
  testimonials
} = siteContent;

export { SITE_CONTENT_STORAGE_KEY };
