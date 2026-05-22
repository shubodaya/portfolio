export const profile = {
  name: "Shubodaya Kumar",
  title: "Network Security Engineer",
  subtitle:
    "I troubleshoot firewall, VPN, and network connectivity issues using logs, packet captures, routing checks, and structured testing.",
  location: "United Kingdom",
  mobility: "Client-site and remote support",
  availability: "Network security, IT support, and technical support services",
  email: "contact@shubodaya.dev",
  phone: "+44 7436301739",
  links: {
    resume:
      "https://docs.google.com/document/d/1_7zbqMzdl_wmW-mcFGJstg1HRwJrlj0dzo48k6ReFBg/edit?usp=sharing",
    linkedin: "https://www.linkedin.com/in/shubodaya/",
    github: "https://github.com/shubodaya",
    blog: "https://blog.shubodaya.dev/",
    youtube: "https://www.youtube.com/@KumarsNetLab",
    portfolio: "https://shubodaya.dev/"
  }
};

export const sceneOrder = ["hero", "about", "experience", "projects", "skills", "certifications", "education", "contact", "outro"];

export const routeNodes = [
  {
    id: "about",
    label: "About",
    short: "ABT",
    signal: "About",
    summary: "SonicWall support, contract field work, cybersecurity study, and repeatable troubleshooting."
  },
  {
    id: "experience",
    label: "Experience",
    short: "EXP",
    signal: "Experience",
    summary: "Firewall, VPN, network support, and field support experience."
  },
  {
    id: "projects",
    label: "Projects",
    short: "PRJ",
    signal: "Projects",
    path: "/projects",
    summary: "Diagnostics, Microsoft security, monitoring, research, and network tooling projects."
  },
  {
    id: "skills",
    label: "Skills",
    short: "SKL",
    signal: "Skills",
    summary: "Firewall, VPN, networking, cloud, security tooling, and support automation."
  },
  {
    id: "certifications",
    label: "Certifications",
    short: "CRT",
    signal: "Certifications",
    summary: "Networking, cloud, security, and support certifications."
  },
  {
    id: "education",
    label: "Education",
    short: "EDU",
    signal: "Education",
    summary: "Cybersecurity education and supporting technical development."
  },
  {
    id: "contact",
    label: "Contact",
    short: "CON",
    signal: "Contact",
    summary: "Contact routes for firewall, VPN, network troubleshooting, IT support, and technical support work."
  }
];

export const about = {
  title: "Network security support built around clear fault isolation.",
  body:
    "I troubleshoot firewall, VPN, and network connectivity issues by connecting symptoms, logs, packet captures, routing checks, and customer impact into clear next steps.",
  nodes: [
    {
      label: "Troubleshoot",
      title: "Firewall and network faults",
      detail: "I work through routing, NAT, DNS, DHCP, VPN paths, LAN/Wi-Fi, firewall policy, and service restoration."
    },
    {
      label: "Analyse",
      title: "Packet-led troubleshooting",
      detail: "I use packet captures, firewall logs, authentication traces, CLI checks, and structured testing to isolate root cause."
    },
    {
      label: "Document",
      title: "Repeatable fixes",
      detail: "I write clear notes, handovers, and knowledge-base style documentation so issues can be resolved faster next time."
    }
  ]
};

export const services = [
  "Connectivity: LAN, Wi-Fi, routing, switching, VPN, DNS, DHCP, and restoration.",
  "Troubleshooting: packet captures, logs, authentication traces, and escalation context.",
  "Security: firewalls, IPS, GAV, App Control, CFS, Geo-IP, MFA, and SIEM labs.",
  "Cloud and automation: Microsoft 365, Entra ID, Intune, Azure, PowerShell, Bash, and documentation."
];

export const highlights = [
  "SonicWall enterprise security support across firewall, VPN, HA, routing, authentication, and SLA-based incidents.",
  "Contract and field-support work across practical network, IT, device setup, connectivity, and client-site tasks.",
  "MSc Cybersecurity with Distinction, supported by networking, cloud, security, and automation certifications.",
  "Operational mindset: restore service, reduce risk, document the fix, and keep users and stakeholders informed."
];

export const rolePages = [
  "Network Support Engineer: routing, switching, LAN/Wi-Fi, DNS/DHCP, and restoration checks.",
  "Security Operations Engineer: firewall support, monitoring, Microsoft Sentinel labs, and incident notes.",
  "IT Support Engineer: device setup, Microsoft 365, client-site support, and documentation.",
  "Network Security Notes: troubleshooting write-ups, lab notes, and repeatable support decisions."
];

export const insights = [
  "Net-Kit: why one operator workspace can reduce friction in diagnostics and support notes.",
  "Network Intrusion Detection with Machine Learning: how traffic classification can support triage.",
  "Field notes across networking, cybersecurity, and automation: practical notes for clearer support work."
];

export const experience = [
  {
    id: "sonicwall",
    company: "SonicWall Technologies",
    role: "Technical Support Engineer",
    period: "May 2021 to Aug 2023",
    location: "Bangalore",
    signal: "Enterprise firewall support",
    summary:
      "24x7 enterprise support across firewall, VPN, HA, routing, authentication, security services, and SLA-based P1-P3 incidents.",
    bullets: [
      "Provided 24x7 firewall support for live enterprise customer environments.",
      "Troubleshot IPsec and SSL VPN issues, including MFA, LDAP, and RADIUS authentication problems.",
      "Worked through NAT/PAT, access rules, routing, OSPF, WAN failover, SD-WAN, DNS/DHCP, and firewall logs.",
      "Supported HA firewall clusters, failover behaviour, firmware-aware issues, and service restoration checks.",
      "Used packet captures, firewall logs, and CLI diagnostics to isolate root cause.",
      "Handled IPS, GAV, App Control, CFS, Geo-IP, Capture ATP, and firewall policy behaviour.",
      "Worked P1-P3 incidents within SLA expectations with clear customer updates and escalation notes.",
      "Wrote knowledge-base documentation and helped junior engineers with troubleshooting steps."
    ],
    tags: ["Firewall", "IPsec VPN", "SSL VPN", "MFA", "LDAP/RADIUS", "Packet captures", "HA", "P1-P3"]
  },
  {
    id: "contract-support",
    company: "Brainotech / Itarmi / Millennial IT Solutions",
    role: "Network Support Engineer contract",
    period: "Sep 2024 to Present",
    location: "Client-site and remote support",
    signal: "Contract and field support",
    summary:
      "Contract and field-support work involving assigned IT/network tasks, device checks, connectivity validation, documentation, and client-site support.",
    bullets: [
      "Support assigned client-site and remote IT/network tasks.",
      "Assist with device setup, diagnostics, cabling, patching, and connectivity checks where required.",
      "Validate access, basic network state, handover notes, and escalation details.",
      "Keep documentation clear for service follow-up and customer communication.",
      "Present this as current contract/field support work without overstating the scope."
    ],
    tags: ["Contract", "Field support", "Device setup", "Connectivity checks", "Documentation", "Client-site support"]
  }
];

export const projects = [
  {
    id: "netravax",
    title: "Netravax",
    subtitle: "Network diagnostics toolkit",
    problem:
      "Network support work can get scattered across packet notes, logs, diagnostics, and handover text.",
    tools: ["Diagnostics workflows", "Packet-capture notes", "Log analysis", "Exports"],
    outcome:
      "A focused workspace for repeatable troubleshooting, support-ready notes, and network/security diagnostics.",
    tags: ["Diagnostics", "Packet capture", "Logs", "Support notes"],
    image: "/assets/projects/netravax.png",
    links: [
      { label: "Live", href: "https://netravax.shubodaya.dev/" },
      { label: "GitHub", href: "https://github.com/shubodaya/net-kit" }
    ]
  },
  {
    id: "microsoft-lab",
    title: "Microsoft Security Lab",
    subtitle: "Microsoft 365 / Entra ID / Intune / Sentinel",
    problem:
      "Security support depends on identity, endpoint posture, authentication visibility, and alert context.",
    tools: ["Microsoft 365", "Entra ID", "Intune", "Azure", "Sentinel", "KQL"],
    outcome:
      "A practical lab for secure access, device-management thinking, telemetry ingestion, Sentinel investigation, and KQL review.",
    tags: ["Identity", "Endpoint", "SIEM", "Cloud security"],
    image: "/assets/projects/hero-command.jpg",
    links: [{ label: "GitHub", href: "https://github.com/shubodaya/HomeSOC" }]
  },
  {
    id: "ml-ids",
    title: "ML Intrusion Detection",
    subtitle: "ML-based intrusion detection system",
    problem:
      "Traffic classification needs to support defender triage, not just produce a headline accuracy metric.",
    tools: ["Python", "scikit-learn", "Dataset preparation", "Traffic analysis"],
    outcome:
      "A research-led intrusion-detection workflow grounded in feature preparation, evaluation, and analyst usefulness.",
    tags: ["Python", "Security analytics", "Traffic classification", "Research"],
    image: "/assets/projects/nids.jpg",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/shubodaya/network-intrusion-detection-ml"
      }
    ]
  },
  {
    id: "outage-monitor",
    title: "Outage Monitor",
    subtitle: "Internet outage monitoring/logging tool",
    problem:
      "Intermittent connectivity issues need timestamped loss, latency, and outage-window records before escalation.",
    tools: ["PowerShell", "Python", "Ping checks", "CSV logs"],
    outcome:
      "A lightweight monitoring workflow that records outage windows and makes connectivity details easier to hand over.",
    tags: ["Connectivity", "Latency", "Support records", "Automation"],
    image: "/assets/projects/network-lab.webp",
    links: []
  },
  {
    id: "automotive-firewall",
    title: "Automotive Network Security Dissertation",
    subtitle: "Policy-driven firewall research",
    problem:
      "In-vehicle networks need clearer threat modelling, trust-boundary mapping, and policy-driven segmentation thinking.",
    tools: ["ISO 21434", "TARA", "Threat modelling", "Security architecture"],
    outcome:
      "Research that connected automotive risk analysis with a proposed software-defined firewall approach for safer network communication.",
    tags: ["Automotive security", "TARA", "Segmentation", "Research"],
    image: "/assets/projects/automotive-topology.webp",
    links: [{ label: "GitHub", href: "https://github.com/shubodaya/SD-Firewall-for-Automotive-Network" }]
  },
  {
    id: "router-verification",
    title: "1x3 Router Design and Verification",
    subtitle: "Verilog / SystemVerilog / UVM",
    problem:
      "Router behaviour needs structured design and verification so data flow, correctness, and protocol handling are testable.",
    tools: ["Verilog", "SystemVerilog", "UVM", "RTL design"],
    outcome:
      "A hardware and verification project that strengthened data-flow reasoning, protocol thinking, and test methodology.",
    tags: ["Verilog", "UVM", "Router", "Verification"],
    image: "/assets/projects/serverblue.png",
    links: [{ label: "GitHub", href: "https://github.com/shubodaya/1x3-Router" }]
  }
];

export const skillClusters = [
  {
    label: "Firewall & Security",
    items: ["Firewalls", "IPS", "GAV", "App Control", "CFS", "Geo-IP", "Capture ATP", "Packet analysis"]
  },
  {
    label: "VPN & Remote Access",
    items: ["IPsec VPN", "SSL VPN", "MFA", "LDAP", "RADIUS", "Authentication", "Secure access"]
  },
  {
    label: "Networking",
    items: ["TCP/IP", "DNS", "DHCP", "NAT/PAT", "VLANs", "OSPF", "PVST+", "Routers", "Switches", "Wireless"]
  },
  {
    label: "Systems",
    items: ["Windows 10/11", "Windows Server", "Linux", "macOS", "Active Directory"]
  },
  {
    label: "Cloud",
    items: ["Microsoft 365", "Entra ID", "Intune", "Azure", "AWS"]
  },
  {
    label: "Monitoring & Tools",
    items: ["Salesforce", "Jira", "PRTG", "Splunk", "Wireshark", "PuTTY", "RDP", "VMware"]
  },
  {
    label: "Scripting & Automation",
    items: ["PowerShell", "Bash", "Git", "JavaScript", "Python", "SQL"]
  }
];

export const certifications = [
  "CCNA",
  "CompTIA Network+",
  "CompTIA Security+",
  "Microsoft Azure Fundamentals AZ-900",
  "Google IT Support Professional",
  "Google IT Automation with Python"
];

export const education = [
  {
    degree: "MSc Cybersecurity with Distinction",
    institution: "Swansea University",
    detail: "Cybersecurity, network security, risk, cloud, and defensive security coursework."
  },
  {
    degree: "BEng Electronics and Communication",
    institution: "Vidya Vardhaka College of Engineering",
    detail: "Electronics, communication systems, networking fundamentals, and systems engineering foundation."
  }
];
