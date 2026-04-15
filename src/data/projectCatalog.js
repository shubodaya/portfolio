import { portfolioSystems } from "./portfolioSystems";

export const projectCategories = [
  "All",
  "Network Security",
  "Pentesting",
  "Web Applications",
  "SaaS Platforms",
  "Creative Platforms",
  "Games and 3D",
  "AI and Automation",
  "Portfolio Systems",
  "Research and Systems"
];

const coreProjects = [
  {
    slug: "netravax",
    title: "Netravax",
    year: "2026",
    category: "Network Security",
    type: "Browser-first network and security workspace",
    summary:
      "A network and security workspace that combines guided workflows, exports, speech tools, and optional desktop packaging in one product.",
    proof:
      "This is the strongest example of blending security tooling, product design, and practical operator workflows.",
    stack: ["React", "TypeScript", "Tauri", "Firebase", "Security workflows"],
    outcomes: [
      "Guided diagnostics, packet capture, and log analysis in one interface",
      "Web-friendly preview with an optional desktop path for deeper local features",
      "A clear product layer on top of blue-team and network experience"
    ],
    image: "/assets/projects/netravax.png",
    alt: "Netravax login screen with a green network mesh background.",
    featured: true,
    links: [
      {
        label: "Live preview",
        url: "https://netravax.shubodaya.dev/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/net-kit"
      },
      {
        label: "Demo video",
        url: "https://youtu.be/ZeOYa8j2g3k"
      }
    ]
  },
  {
    slug: "network-lab",
    title: "Network Lab and Core Services",
    year: "2025",
    category: "Network Security",
    type: "Hands-on infrastructure lab",
    summary:
      "A combined Cisco and server lab for routing, switching, DNS, DHCP, Active Directory, VPN validation, and controlled troubleshooting.",
    proof:
      "This is where the network and platform fundamentals are visible without product gloss hiding the mechanics.",
    stack: ["Cisco", "EVE-NG", "Windows Server", "Linux", "Active Directory"],
    outcomes: [
      "Built repeatable lab scenarios for connectivity and service validation",
      "Used the environment to test core services, segmentation, and operational changes",
      "Supports the rest of the portfolio with real infrastructure depth"
    ],
    image: "/assets/projects/network-lab.webp",
    alt: "Server racks lit with blue and amber lights.",
    featured: true,
    links: []
  },
  {
    slug: "home-soc",
    title: "Home SOC with Microsoft Sentinel",
    year: "2025",
    category: "Network Security",
    type: "Detection engineering lab",
    summary:
      "An Azure-based SOC lab focused on telemetry ingestion, suspicious-authentication analysis, and analyst-friendly investigation flows.",
    proof:
      "Shows how offensive thinking, log visibility, and defensive response can be tied together in one environment.",
    stack: ["Azure", "Microsoft Sentinel", "KQL", "Threat hunting"],
    outcomes: [
      "Configured ingestion, alert logic, and analyst workflows",
      "Used the lab to validate whether suspicious behavior is actually visible to defenders",
      "Acts as a bridge between security engineering and investigation work"
    ],
    image: "/assets/projects/hero-command.jpg",
    alt: "Security operations room filled with monitoring displays.",
    featured: true,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/HomeSOC"
      }
    ]
  },
  {
    slug: "intrusion-detection-ml",
    title: "Network Intrusion Detection with Machine Learning",
    year: "2025",
    category: "Network Security",
    type: "Research-driven security project",
    summary:
      "A machine-learning intrusion-detection workflow that classifies network traffic while staying grounded in operational usefulness.",
    proof:
      "Shows research range without pretending ML replaces packet-level reasoning or analyst judgment.",
    stack: ["Python", "scikit-learn", "Data prep", "Traffic analysis"],
    outcomes: [
      "Prepared datasets and feature pipelines for classification work",
      "Measured value in terms of triage usefulness, not only headline accuracy",
      "Connects security analytics to practical network investigation"
    ],
    image: "/assets/projects/nids.jpg",
    alt: "Close-up of colorful code on a screen.",
    featured: true,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/network-intrusion-detection-ml"
      }
    ]
  },
  {
    slug: "owasp-dvwa",
    title: "OWASP Top 10 and WAF Validation Lab",
    year: "2025",
    category: "Pentesting",
    type: "Offensive validation lab",
    summary:
      "A lab that tests common web attack paths against DVWA and compares exploitability before and after WAF tuning.",
    proof:
      "Useful because it goes past payload screenshots and into logging quality, residual risk, and what must be fixed in code.",
    stack: ["DVWA", "Burp Suite", "OWASP Top 10", "WAF tuning"],
    outcomes: [
      "Validated injection and misconfiguration scenarios manually",
      "Compared application exposure before and after defensive changes",
      "Documented where the real remediation belongs"
    ],
    image: "/assets/projects/owasp-illustration.jpg",
    alt: "OWASP illustration with a magnifying glass on a web page.",
    featured: true,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/OWASP-with-DVWA"
      }
    ]
  },
  {
    slug: "automotive-firewall",
    title: "Automotive Network Security Dissertation",
    year: "2024",
    category: "Research and Systems",
    type: "Academic and architecture research",
    summary:
      "Research on in-vehicle network security using ISO 21434 TARA with a proposed software-defined firewall model.",
    proof:
      "Shows that the portfolio can move from incident and lab work into structured risk analysis and systems thinking.",
    stack: ["ISO 21434", "TARA", "Threat modeling", "Security architecture"],
    outcomes: [
      "Mapped threats, assets, and trust boundaries in an automotive context",
      "Proposed policy-driven segmentation logic for safer in-vehicle communication",
      "Turned academic work into a technical architecture discussion"
    ],
    image: "/assets/projects/automotive-topology.webp",
    alt: "Abstract network topology with a globe and connected systems.",
    featured: false,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/SD-Firewall-for-Automotive-Network"
      }
    ]
  },
  {
    slug: "router-verification",
    title: "1x3 Router Design and Verification",
    year: "2021",
    category: "Research and Systems",
    type: "Hardware and verification project",
    summary:
      "RTL design and UVM verification work around a 1x3 router, built during graduate training at Maven Silicon.",
    proof:
      "Adds hardware reasoning and system-verification work to a portfolio that already spans infrastructure and software.",
    stack: ["Verilog", "SystemVerilog", "UVM", "RTL design"],
    outcomes: [
      "Designed and verified router behavior with structured test methodology",
      "Worked through data flow, correctness, and protocol behavior",
      "Shows early systems-engineering discipline"
    ],
    image: "/assets/projects/serverblue.png",
    alt: "Close-up of network hardware with cables and lit ports.",
    featured: false,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/1x3-Router"
      }
    ]
  },
  {
    slug: "emergency-activation",
    title: "Emergency Activation in Automobiles Using IoT",
    year: "2020",
    category: "Research and Systems",
    type: "Embedded and IoT project",
    summary:
      "A final-year engineering project that explored emergency activation workflows in automobiles using IoT components and connected logic.",
    proof:
      "Shows the engineering path before the portfolio moved more heavily into security and product software.",
    stack: ["IoT", "Embedded systems", "Electronics", "Automotive context"],
    outcomes: [
      "Built a practical project around connected activation logic",
      "Applied electronics and communication fundamentals in a systems context",
      "Rounds out the portfolio with earlier engineering work"
    ],
    image: "/assets/projects/binary-rain.png",
    alt: "Dark background with falling binary digits.",
    featured: false,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/Emergency-Activation-in-Automobiles-Using-IOT"
      }
    ]
  },
  {
    slug: "ai-friend",
    title: "AI-Friend",
    year: "2026",
    category: "AI and Automation",
    type: "Voice-first local AI application",
    summary:
      "A fully local voice-first web app that captures audio in the browser, transcribes with whisper.cpp, chats through Ollama, and speaks back with Piper.",
    proof:
      "This project shows end-to-end AI integration across frontend, backend, streaming, and local-first product thinking.",
    stack: ["React", "FastAPI", "WebSocket streaming", "Ollama", "Piper"],
    outcomes: [
      "Built an offline-first conversation loop after model setup",
      "Integrated speech-to-text, local LLM chat, and text-to-speech",
      "Demonstrates AI work that is more practical than demo-only"
    ],
    image: "/assets/projects/ai-automation.jpg",
    alt: "Close-up of Python code on a screen.",
    featured: true,
    links: [
      {
        label: "Live preview",
        url: "https://shubodaya.github.io/AI-friend/"
      }
    ]
  },
  {
    slug: "dutyorbit",
    title: "DutyOrbit",
    year: "2026",
    category: "SaaS Platforms",
    type: "Workforce scheduling platform",
    summary:
      "A scheduling and attendance platform for employers and employees covering shifts, time-off requests, timesheets, and office clock-ins.",
    proof:
      "Shows product thinking for role-based workflows, business logic, and daily operations beyond the cybersecurity lane.",
    stack: ["React", "Scheduling workflows", "Attendance logic", "Platform UX"],
    outcomes: [
      "Employer and employee experiences designed around different responsibilities",
      "Shift planning, attendance, approval flows, and timesheet tracking",
      "A strong example of a business-facing platform build"
    ],
    image: "/assets/projects/dutyorbit-browser.png",
    alt: "DutyOrbit landing page with workforce scheduling dashboard and staff workflow preview.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://dutyorbit.shubodaya.dev/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/rota"
      }
    ]
  },
  {
    slug: "ledgeraq",
    title: "Ledgeraq",
    year: "2026",
    category: "Web Applications",
    type: "Collaborative expense suite",
    summary:
      "A polished expense platform for shared budgets across trips, roommates, and teams, with dashboards, categories, and collaborative flows.",
    proof:
      "Shows visual polish, dashboard design, and data-heavy product UI beyond a generic CRUD build.",
    stack: ["React", "Vite", "Firebase", "Analytics UI"],
    outcomes: [
      "Dashboard-first experience with category insight and shared spend views",
      "Built for recurring collaboration rather than one-off forms",
      "Demonstrates stronger product taste on the frontend"
    ],
    image: "/assets/projects/ledgeraq.png",
    alt: "Ledgeraq dashboard showing spend by period and category.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://ledgeraq.shubodaya.dev/"
      }
    ]
  },
  {
    slug: "gymbud",
    title: "GymBud",
    year: "2026",
    category: "Web Applications",
    type: "Fitness platform",
    summary:
      "A full-stack fitness product with authentication, workout planning, nutrition tracking, progress analytics, and wearable integration planning.",
    proof:
      "Shows how the product work extends into denser application flows with auth, data models, and dashboard structure.",
    stack: ["Next.js", "Cloudflare Pages Functions", "Prisma", "PostgreSQL"],
    outcomes: [
      "Secure auth and password-reset flows with production-minded handling",
      "Workout, nutrition, analytics, and social features in one product",
      "A more ambitious application surface than a simple landing page"
    ],
    image: "/assets/projects/gymbud.webp",
    alt: "Fitness-themed hero image with gym equipment and training overlays.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://gym-bud.pages.dev"
      }
    ]
  },
  {
    slug: "study-mate",
    title: "Study Mate",
    year: "2026",
    category: "Web Applications",
    type: "Productivity workspace",
    summary:
      "A productivity workspace for study planning, job search tracking, document preparation, and personal routines.",
    proof:
      "Shows the ability to design structured, multi-purpose product surfaces that still feel coherent for users.",
    stack: ["React", "Vite", "Firebase", "Workflow design"],
    outcomes: [
      "Unified multiple personal productivity workflows under one product",
      "Balanced dense functionality with readable layout structure",
      "Adds more evidence of full-stack product range"
    ],
    image: "/assets/projects/studymate.webp",
    alt: "Students collaborating around a desk with productivity overlays in the background.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://study-mate.pages.dev"
      }
    ]
  },
  {
    slug: "ordercircuit",
    title: "OrderCircuit",
    year: "2026",
    category: "SaaS Platforms",
    type: "Ordering and staff platform",
    summary:
      "A multi-route ordering platform with authentication, company portals, menu management, and staff-side operational views.",
    proof:
      "Demonstrates deeper route handling and business logic in a platform meant to support both customers and staff.",
    stack: ["React", "Cloudflare", "Routing", "Ordering workflows"],
    outcomes: [
      "Company-specific routes and menu flows",
      "Customer and staff experiences under one product system",
      "Strong multi-surface application design"
    ],
    image: "/assets/projects/ordercircuit.webp",
    alt: "Illustrated food ordering wallpaper with burgers, pizza, fries, and drinks.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://foodorder.pages.dev/"
      }
    ]
  },
  {
    slug: "folique",
    title: "Folique",
    year: "2026",
    category: "Web Applications",
    type: "Portfolio builder platform",
    summary:
      "A portfolio builder that lets users sign in, fill portfolio data, choose templates, generate a repository, and publish to GitHub Pages.",
    proof:
      "This is a product that turns portfolio work itself into a platform for other people to use, which is a strong systems-level step up.",
    stack: ["Next.js", "Cloudflare Pages Functions", "Neon", "Template generation"],
    outcomes: [
      "Full workflow from account to published portfolio",
      "Template-driven generation plus GitHub publishing flow",
      "A strong blend of product design and developer tooling"
    ],
    image: "/assets/projects/story-it.png",
    alt: "Portfolio interface on screens with code and dashboard visuals.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://folique.pages.dev"
      }
    ]
  },
  {
    slug: "companion-village",
    title: "CompanionVillage",
    year: "2026",
    category: "Web Applications",
    type: "Trusted marketplace product",
    summary:
      "A welfare-first pet marketplace with trusted discovery, verified seller flows, moderated listings, and safer enquiry journeys.",
    proof:
      "Shows how trust, search, moderation, and multi-role marketplace UX can be shaped into one coherent application.",
    stack: ["React 19", "TypeScript", "React Router", "Marketplace UX", "Admin workflows"],
    outcomes: [
      "Buyer, seller, and admin surfaces designed around different responsibilities",
      "Verification-first listing flows with welfare and trust signals built into the UX",
      "A marketplace product that balances discovery, moderation, and conversion"
    ],
    image: "/assets/projects/companion-village-browser.png",
    alt: "CompanionVillage marketplace homepage with trusted pet listings and search filters.",
    featured: true,
    links: []
  },
  {
    slug: "portfolio-builder",
    title: "Portfolio Builder",
    year: "2026",
    category: "SaaS Platforms",
    type: "Portfolio publishing platform",
    summary:
      "A template-driven portfolio builder with authentication, resume parsing, live preview, public pages, and GitHub Pages deployment flows.",
    proof:
      "This turns portfolio creation itself into a product with account logic, template systems, uploads, previews, and deployment handling.",
    stack: ["React 19", "TypeScript", "Firebase", "Resume parsing", "GitHub Pages"],
    outcomes: [
      "Template selection, live preview, and public-page publishing in one workspace",
      "Resume import and structured form editing for faster page creation",
      "A stronger product example for builder workflows and developer-adjacent tooling"
    ],
    image: "/assets/projects/site-portfolio-builder-browser.png",
    alt: "Portfolio Builder application with account form and live preview workflow.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://shubodaya.github.io/portfolio-builder/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/portfolio-builder"
      }
    ]
  },
  {
    slug: "rebel-riders",
    title: "Rebel Riders",
    year: "2026",
    category: "Creative Platforms",
    type: "Community experience platform",
    summary:
      "A biker community site covering rides, events, join requests, moderation, accessories, and rider-focused safety content.",
    proof:
      "Shows how a branded community product can still carry deeper flows like search, event management, moderation, and member actions.",
    stack: ["React", "Vite", "Event workflows", "Community UX", "Admin moderation"],
    outcomes: [
      "Events, rider discovery, and join-request flows presented in a strong visual brand",
      "Community moderation paths rather than a static brochure experience",
      "A category of work that expands the portfolio beyond utility-first products"
    ],
    image: "/assets/projects/rebel-riders-browser.png",
    alt: "Rebel Riders landing page with biker community hero and event CTA.",
    featured: true,
    links: [
      {
        label: "Live site",
        url: "https://shubodaya.github.io/rebel-riders/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/rebel-riders"
      }
    ]
  },
  {
    slug: "shutter-speed",
    title: "ShutterSpeed",
    year: "2026",
    category: "Creative Platforms",
    type: "Photography brand platform",
    summary:
      "A photography and videography brand site with services, packages, galleries, testimonials, and booking flows.",
    proof:
      "Brings visual direction, conversion paths, and service presentation together in a more editorial product surface.",
    stack: ["React", "Vite", "Visual storytelling", "Service design"],
    outcomes: [
      "Service packaging and inquiry flow structured around creative work",
      "Portfolio and testimonial sections shaped for bookings, not only browsing",
      "A strong example of branded presentation without losing conversion clarity"
    ],
    image: "/assets/projects/shutter-speed-browser.png",
    alt: "ShutterSpeed homepage with cinematic photography brand layout.",
    featured: false,
    links: [
      {
        label: "Live site",
        url: "https://shubodaya.github.io/shutter-speed/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/shutter-speed"
      }
    ]
  },
  {
    slug: "true-aesthete",
    title: "True Aesthete",
    year: "2026",
    category: "Creative Platforms",
    type: "Studio and commission platform",
    summary:
      "A portrait studio site for commissions, gallery sales, classes, process guidance, and client enquiries.",
    proof:
      "Shows how commerce, commissions, and guided learning can fit inside one visual product without feeling cluttered.",
    stack: ["React", "Vite", "Gallery UX", "Commission workflows"],
    outcomes: [
      "Commission, gallery, and class journeys designed for different visitor intents",
      "Visual merchandising paired with service and trust-building content",
      "Another example of brand-heavy product work with real functional structure"
    ],
    image: "/assets/projects/true-aesthete-browser.png",
    alt: "True Aesthete homepage with studio branding and commission-led visuals.",
    featured: false,
    links: [
      {
        label: "Live site",
        url: "https://shubodaya.github.io/true-aesthete/"
      },
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/true-aesthete"
      }
    ]
  },
  {
    slug: "mustang-track-drive",
    title: "Mustang GT Track Drive",
    year: "2026",
    category: "Games and 3D",
    type: "Three.js driving prototype",
    summary:
      "A lightweight arcade driving prototype built with Three.js, a custom driving model, and a browser-first track loop.",
    proof:
      "Adds real-time 3D interaction, camera framing, and gameplay logic to a portfolio already weighted toward apps and infrastructure.",
    stack: ["Three.js", "Vite", "3D interaction", "Gameplay logic"],
    outcomes: [
      "Track, HUD, car controls, and lightweight drifting behavior in one prototype",
      "A stronger interactive layer than a static 3D hero section",
      "Shows comfort building browser-based experiences outside traditional SaaS work"
    ],
    image: "/assets/projects/mustang-track-browser.png",
    alt: "Mustang GT track drive prototype with the car on a track and start prompt.",
    featured: false,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/car-game"
      }
    ]
  },
  {
    slug: "character-play",
    title: "Character Play Prototype",
    year: "2026",
    category: "Games and 3D",
    type: "Third-person character controller",
    summary:
      "A browser-based third-person character controller prototype with procedural motion, camera control, jumping, and obstacle navigation.",
    proof:
      "Brings rig handling, procedural animation, 3D scene control, and interaction design into the broader portfolio.",
    stack: ["Three.js", "Vite", "Procedural animation", "Character controller"],
    outcomes: [
      "Procedural locomotion built around the available rig instead of stock animation clips",
      "Third-person movement, jump, camera, and traversal prototyping in the browser",
      "A clean example of 3D systems work adjacent to the portfolio's application layer"
    ],
    image: "/assets/projects/character-play-browser.png",
    alt: "Third-person character controller prototype with a character standing in a test arena.",
    featured: true,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/shubodaya/character-play"
      }
    ]
  }
];

export const projects = [...coreProjects, ...portfolioSystems];
