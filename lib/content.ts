// All content here is sourced from Anushka's resume. Nothing fabricated.

export type Mode = 'playful' | 'professional'

export const profile = {
  name: 'Anushka Purwar',
  title: 'Product Manager · Founder’s Office · Builder',
  one: {
    playful: 'This Barbie loves building products.',
    professional: 'Product, GTM, and operator-thinking — built across founder’s offices and student-run accelerators.',
  },
  long: {
    playful:
      'I’m Anushka — part product thinker, part operator, part founder’s-office intern, full-time problem solver. I like messy zero-to-one problems and shipping things that move a number.',
    professional:
      'BITS Pilani student in CS & Finance with hands-on experience across product, GTM, and operations at early-stage startups, plus mentor-and-government leadership at Asia’s largest student-run accelerator.',
  },
  email: 'f20231173@pilani.bits-pilani.ac.in',
  phone: '+91-9205727214',
  linkedin: 'https://www.linkedin.com/in/anushka-purwar-5479712aa/',
  resume: '/resume.pdf',
  education: 'B.E. + Minor in Finance, BITS Pilani · 2023–2027',
}

export const experiences = [
  {
    role: 'Product & GTM Intern',
    company: 'Stealth — under ex-Product leadership from Uber & Meesho',
    period: 'Sept 2025 – Nov 2025',
    color: 'bg-lilac/30',
    problem:
      'Early-stage product with no validated wedge — needed to find the first 1,000 leads and a problem worth solving.',
    actions: [
      'Built an automated lead sourcing & scraping system across Reddit and Instagram, surfacing ~1,000 qualified leads.',
      'Drove −1 → 0 product discovery — user interviews, low-fidelity prototypes, and adoption tests.',
      'Ran growth experiments — marketing assets, landing pages, and funnels — to validate demand across multiple problem spaces.',
    ],
    impact: ['~1,000 leads sourced', 'End-to-end discovery loop', 'Demand validated in days, not weeks'],
  },
  {
    role: 'Founder’s Office Intern',
    company: 'Shoffr',
    period: 'June 2025 – Aug 2025',
    color: 'bg-blush',
    problem: 'Early-stage chauffeured-mobility startup looking for repeatable client acquisition and retention plays.',
    actions: [
      'Owned client outreach, follow-ups, and coordination — directly contributing to acquisition.',
      'Researched and piloted a potential new business channel end-to-end.',
      'Structured a customer loyalty initiative — research, framing, and internal alignment.',
    ],
    impact: ['New channel piloted', 'Loyalty program scoped', 'Hands-on with founder weekly'],
  },
  {
    role: 'Founder’s Office Intern',
    company: 'Pinch',
    period: 'April 2025 – May 2025',
    color: 'bg-sage/40',
    problem:
      'Manual supply-chain and finance workflows were leaking time and creating cross-team friction.',
    actions: [
      'Led end-to-end operational streamlining of supply chain and finance — reducing TAT and cross-team thrash.',
      'Wrote PRDs end-to-end, partnering with product, design, and engineering.',
      'Built Google Apps Script automations that removed manual steps and reduced human error.',
    ],
    impact: ['Lower TAT', 'PRDs shipped', 'Apps Script automations live'],
  },
  {
    role: 'Mentor & Government Relations Lead',
    company: 'Conquest — E-Cell, BITS Pilani · Asia’s largest student-run accelerator',
    period: 'Feb 2024 – Aug 2025',
    color: 'bg-cream',
    problem:
      'Match a cohort of high-signal startups to the right mentors, and bring serious external gravity to the program.',
    actions: [
      'Evaluated 1,000+ startups, led 120+ founder interviews, and assessed 200+ pitch decks — driving end-to-end mentor matching.',
      'Built the relationship with Sumeet Jarangal (Director, Startup India) for strategic initiatives and government support.',
      'Negotiated key partnerships saving ₹5L+ and curated an audience of 300+ top-tier VCs, founders, and industry leaders.',
    ],
    impact: ['1,000+ startups evaluated', '₹5L+ saved in partnerships', '300+ VCs & founders curated'],
  },
  {
    role: 'Joint Coordinator',
    company: 'BITS Pilani Consulting Club',
    period: 'June 2024 – Aug 2025',
    color: 'bg-blush/70',
    problem: 'Run real consulting engagements while scaling the club’s flagship event and cross-campus reach.',
    actions: [
      'Led consulting projects for Infosys, Visit Health, and Origin Health — across growth, GTM, ops, and segmentation.',
      'Secured ₹60K in sponsorship from Infra.Market and drove 1,300+ registrations for CaseQuesta (Apogee’s flagship).',
      'Partnered with The ARC to execute an Inter-BITS consulting competition.',
    ],
    impact: ['3 client engagements', '1,300+ registrations', '₹60K sponsorship'],
  },
  {
    role: 'Teaching Assistant',
    company: 'BITS Digital — Writing Practice & Environmental Sciences',
    period: 'Sept 2025 – May 2026',
    color: 'bg-cream',
    problem: 'Help ~1,000 students improve their academic writing at scale.',
    actions: [
      'Evaluated and graded 1,000+ assignments with constructive feedback.',
      'Supported instructors on planning, scheduling, and classroom resources.',
      'Tracked student progress and worked with faculty on targeted interventions.',
    ],
    impact: ['1,000+ assignments graded', 'Two courses supported'],
  },
]

export const projects = [
  {
    name: 'Sahaay',
    tag: 'Hyperlocal Women’s Safety App',
    stack: ['Flutter', 'Firebase'],
    link: '#', // TODO: drop real URL (GitHub / demo)
    linkLabel: 'View prototype',
    body: [
      'Full-stack Flutter app with real-time SOS triggering, geo-matched responder system, and consented victim–responder connections (chat/call).',
      'Designed end-to-end from PRD → working prototype, including a community crime heatmap and core user flows.',
    ],
    why:
      'Built because the existing market for women’s safety apps is loud on alarms, quiet on what happens after the alarm. This focuses on the response loop.',
  },
  {
    name: 'Lead Sourcing Engine',
    tag: 'Python · Selenium',
    stack: ['Python', 'Selenium', 'Reddit', 'Instagram'],
    link: '#', // TODO: drop real URL (GitHub)
    linkLabel: 'View on GitHub',
    body: [
      'Dual-platform scraper across Reddit (comment-intent parsing) and Instagram (hashtag traversal + follower filtering + contact details).',
      'Automated pipeline surfacing ~1,000 qualified leads, structured and exported to Excel for outreach.',
    ],
    why: 'Removed a week of manual sourcing per cycle and made the GTM funnel falsifiable instead of vibe-based.',
  },
  {
    name: 'Coursera Auto-Grader',
    tag: 'Vanilla JS · Browser Automation',
    stack: ['JavaScript', 'DOM Automation'],
    link: '#', // TODO: drop real URL (GitHub / Gist)
    linkLabel: 'View script',
    body: [
      'Console-injectable JS script that automates rubric-based grading across 1,000+ submissions with a plagiarism-to-score weighted algorithm.',
      'Handles edge cases (no file, no text), auto-paginates across learner pages, and guards against double-grading.',
    ],
    why: 'Cut grading time from days to hours — so feedback could actually be useful while the assignment was still fresh.',
  },
]

export const research = [
  {
    title: 'Financial Management of MSMEs in Rajasthan',
    advisor: 'Prof. Rajesh Matai (Senior IEEE Member)',
    period: 'Jan 2026 – May 2026',
    body:
      'Panel Data Regression on 15 years of MSME data (Prowess, CMIE) — extracting firm-level datasets to analyze financial performance.',
  },
  {
    title: 'Lung Fibrosis — Laboratory Research',
    advisor: 'Prof. Rajeev Taliyan, HOD Pharmaceutical Sciences',
    period: 'Jan 2026 – May 2026',
    body:
      'Selected among 6 students across 4 batches for a lung fibrosis program; applying cell culture techniques to support experimental analysis.',
  },
  {
    title: 'Menstrual Blood-Derived Stem Cells (MenSCs)',
    advisor: 'Prof. Aniruddha Roy',
    period: 'Aug 2025 – Dec 2025',
    body:
      'Initiated independent research, contributing personal biological samples for stem cell isolation in an under-explored, stigmatized domain.',
  },
]

export const achievements = [
  '4th of 370+ · Nexus — The Strategy Enigma · IIM Lucknow × IIM Rohtak',
  'National Finalist · B-Plan Competition, IIT Bhubaneswar',
  'Winner · Multiverse of Marketing, BITS Pilani',
  'Finalist · D. E. Shaw & Co. Finspire Fellowship',
  'Selected · Harvard Project for Asian and International Relations (HPAIR ’24)',
  '99.9 percentile · Chemistry, CUET',
  'Best Delegate · All India Political Party Meet (MUN)',
  'Member · Dance Club, BITS Pilani',
]

export const skills = {
  Product: ['Product Strategy', 'PRDs', 'Discovery (−1→0)', 'Wireframing', 'User Research'],
  Growth: ['Funnels', 'Landing Pages', 'Lead Gen', 'GTM Experiments'],
  Build: ['Figma', 'Flutter', 'Firebase', 'Google Apps Script', 'Selenium'],
  Data: ['SQL', 'Excel', 'Panel Data Regression', 'Python (beginner)'],
  Soft: ['Stakeholder Mgmt', 'Storytelling', 'Negotiation', 'Cross-functional ownership'],
}

export const easterEgg = {
  playful:
    'Fun fact: I’ve reviewed 1,000+ startup decks at Conquest — and I still believe mine would win.',
  professional:
    'Fun fact: Across Conquest I evaluated 1,000+ startups, ran 120+ founder interviews, and reviewed 200+ pitch decks.',
}
