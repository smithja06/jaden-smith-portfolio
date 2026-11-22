import { TODO_USER_CONTENT, type ExperienceEntry, type ExperienceGroup } from './types';

/**
 * Every role, team and competition. Ordered newest first within a group by
 * `start` (a sort key only — it is never displayed). Leadership entries that
 * extend a technical role point back to it with `seeAlso` instead of
 * repeating it.
 */
export const experience: ExperienceEntry[] = [
  /* ---------------- Technical & professional engineering ---------------- */
  {
    id: 'rbc',
    group: 'technical',
    org: 'Royal Bank of Canada (RBC)',
    title: 'AI / Machine Learning Engineer Co-op',
    location: 'Toronto, Ontario',
    dates: 'Sep 2026 – present',
    start: '2026-09',
    note: '12-month co-op · Technology & Operations',
    summary:
      'I own the simulation and validation tooling around a team-built payment-routing engine, work solo on agent-readiness and AI automation, and teach spec-driven development courses to engineers in the organization.',
    coreTech: ['Java', 'Spring Boot', 'Python', 'AI agents'],
    tech: ['Java', 'Spring Boot', 'Three.js', 'IBM MQ', 'Microsoft Entra ID', 'React', 'TypeScript', 'FastAPI', 'MongoDB Atlas', 'Python', 'Devin Cloud', 'Spec Kit', 'Google Analytics 4', 'REST APIs', 'AI agents'],
    metrics: [
      { value: '~99.9%', label: 'rule-exit agreement · 15,000+ payments', note: 'Comparative testing against production results.' },
      { value: '379 / 399', label: 'legacy features verified' },
      { value: '100+', label: 'repositories audited for agent readiness' },
    ],
    projects: [
      'rbc-payment-routing-simulation',
      'rbc-legacy-rules-reconstruction',
      'rbc-agent-readiness-framework',
      'rbc-engineering-agents',
      'rbc-ai-sdlc-observability',
      'rbc-ai-adoption-analytics',
    ],
    initiatives: [
      {
        title: 'Payment Routing Engine & Simulation Tooling',
        ownership: 'major',
        ownershipNote: 'My tools; the team’s engine.',
        summary: 'Simulation, tracing, discrepancy and explainability tools around a Java / Spring Boot payment-routing engine.',
        points: [
          'Built the payment simulator, rule tracker, discrepancy tracker and per-payment trace debugger.',
          'Built an explainability view showing how the rules engine evaluated and decided each payment.',
          'Built a Three.js payments globe with sign-in screen and simulated flows, plus a 2D world map.',
          'Resolved 100+ discrepancies between engine logic and expected results.',
          'IBM MQ integration and Microsoft Entra ID sign-in are in progress.',
        ],
        metrics: [
          { value: '~99.9%', label: 'rule-exit agreement', note: 'Across 15,000+ payments, compared with production results. Validation, not a production rollout.' },
          { value: '100+', label: 'discrepancies resolved' },
        ],
        projects: ['rbc-payment-routing-simulation'],
      },
      {
        title: 'Legacy Banking Application Reverse Engineering',
        ownership: 'sole',
        summary: 'Recovered a compiled legacy rules application’s behaviour and rebuilt its features.',
        points: [
          'Rule tracing and management across 5,000+ rules, rule uploads and automated correspondent-file generation.',
          'SSO sign-in for the rebuilt application is in progress.',
        ],
        metrics: [{ value: '379 / 399', label: 'features verified against the original' }],
        projects: ['rbc-legacy-rules-reconstruction'],
      },
      {
        title: 'Agent Readiness Framework',
        ownership: 'sole',
        summary: 'A framework scoring how ready repositories are for AI agents: 10 pillars, 81 criteria, 5 maturity levels.',
        points: ['Historical findings, HTML dashboards and remediation guidance for each repository.'],
        metrics: [
          { value: '100+', label: 'repositories audited' },
          { value: '~85%', label: 'less assessment time', note: 'From my own testing against manual assessment.' },
        ],
        projects: ['rbc-agent-readiness-framework'],
      },
      {
        title: 'Devin Cloud Agents & Automation',
        ownership: 'sole',
        summary: 'Agents that run the readiness audits and automate engineering workflows.',
        points: [
          'All of these run as Devin Cloud automations, not by hand: repository audits for the Agent Readiness framework, failure triage, vulnerability remediation, requirements analysis and architecture documentation.',
        ],
        projects: ['rbc-engineering-agents'],
      },
      {
        title: 'Spec Kit Bug-Fix Extension',
        ownership: 'sole',
        summary: 'A Spec Kit extension that analyzes the bugs a user reports, applies a fix and documents each one, building a history so a diagnosed bug is never analyzed twice.',
        points: [
          'Produces a report for every bug: what was found, the proposed remediation, how the fix was applied and the files it changed.',
          'Keeps a history of every bug it has handled, so a similar bug is not analyzed from scratch: the previously diagnosed process is reused.',
        ],
      },
      {
        title: 'AI SDLC Instrumentation',
        ownership: 'team',
        ownershipNote: 'Individual scope still being documented.',
        summary: 'A Spec Kit extension with 16 hooks across 8 AI SDLC phases, collecting token, cost and duration data into Google Analytics 4.',
        points: [
          'Produces a JSON history of the whole development process.',
          'Generates an HTML report with all the metrics, broken down per user story and per Spec Kit phase.',
        ],
        projects: ['rbc-ai-sdlc-observability'],
      },
      {
        title: 'AI Adoption Analysis & Organizational Enablement',
        ownership: 'contributor',
        ownershipNote: 'The portal is a team build.',
        summary: 'Scanned repositories, gathered technical information and broke down AI-adoption findings for an organization-wide analysis of 15,000+ repositories.',
        projects: ['rbc-ai-adoption-analytics'],
      },
      {
        title: 'Spec-Driven Development Education',
        ownership: 'lead',
        summary: 'Facilitated courses on spec-driven development for engineers within the organization.',
        projects: ['rbc-ai-sdlc-observability', 'rbc-ai-adoption-analytics'],
      },
    ],
  },
  {
    id: 'med-t',
    group: 'technical',
    org: 'McMaster MED-T',
    title: 'System Control Subteam Lead',
    location: 'Hamilton, Ontario',
    dates: 'Apr 2026 – present',
    start: '2025-10',
    note: 'Team member Oct 2025 – Mar 2026',
    summary:
      'I lead the system-control subteam — setting requirements and milestones, interviewing and onboarding members, and coordinating integration with the other subteams — while writing the firmware and vision code myself.',
    contributions: [
      'Implemented the ESP32 firmware, output multiplexing, PWM intensity ramps and UART frame communication.',
      'Built the OpenCV / K-means visual pipeline and the mapping from frames to discrete output states.',
      // Hardware specifics (PCA9685 over I²C, ~1 kHz PWM) live in the MED-T case study.
      'Brought up a fully working 4×4 LED bench prototype.',
      'Leading the move to a 6×4 actuator array, targeted for January–February 2027.',
    ],
    leadership: [
      'Coordinate system-control requirements and technical milestones.',
      'Interview and onboard new members.',
      'Manage electronics inventory and restore hardware.',
      'Integrate and test across subteams.',
    ],
    outcome: 'Fully working 4×4 bench prototype.',
    coreTech: ['ESP32', 'C / C++', 'OpenCV'],
    tech: ['ESP32', 'C / C++', 'Python', 'OpenCV', 'K-means clustering', 'UART', 'I²C', 'PCA9685', 'PWM & multiplexing'],
    projects: ['med-t-sensory-substitution', 'esp32-led-matrix-driver'],
    evidence: { repo: TODO_USER_CONTENT, report: TODO_USER_CONTENT },
  },
  {
    id: 'bmett',
    group: 'technical',
    org: 'McMaster BMETT',
    title: 'Software Team Member',
    location: 'Hamilton, Ontario',
    dates: '2025 – present',
    start: '2025-10',
    note: 'Two seasons: 2025–26 and 2026–27',
    summary:
      'I’m responsible for the team’s web application, working with the hardware and ML members to turn live sensor data into screens that patients and clinicians can use.',
    contributions: [
      '2026–27: researching and preparing a disaster-triage device concept for the True North Biomedical Competition — triage models, patient-monitor background and bias in readings across race, age and weight.',
      'Built the full web app: patient and clinician views, rehab plans, exercises, session history and analytics.',
      'Parsed magnetometer and IMU data and built trend dashboards against baseline ACL performance.',
      'Real-time BLE streaming worked, and the ML system was tested with live sensor input.',
    ],
    outcome: 'Real-time BLE streaming working, with the ML system tested on live sensor input.',
    coreTech: ['React', 'TypeScript', 'BLE'],
    tech: ['React', 'TypeScript', 'BLE', 'IMU & magnetometer', 'Data visualization & dashboards'],
    projects: ['bmett-acl-rehabilitation', 'bmett-acl-movement-classification'],
    evidence: { repo: TODO_USER_CONTENT, report: TODO_USER_CONTENT },
  },
  {
    id: 'swift-coop',
    group: 'technical',
    org: 'App Development with Swift Co-op',
    title: 'iOS Student App Developer',
    location: 'Hamilton, Ontario',
    dates: 'Feb – Jun 2023',
    start: '2023-02',
    note: 'Apple-partnered program',
    summary: 'Built four iOS apps in Swift, including an augmented-reality shopping app presented to Apple judges.',
    // The four apps and the Apple-judges presentation are in the summary; not repeated here.
    contributions: [
      'Used Firebase Authentication for sign-in and sessions.',
      'Worked in sprints with technical and business mentors, tying product decisions to user needs.',
    ],
    coreTech: ['Swift', 'Augmented reality', 'Firebase Authentication'],
    tech: ['Swift', 'iOS development', 'Augmented reality', 'Firebase Authentication'],
    projects: ['ar-shopping-ios', 'other-swift-apps'],
  },

  /* ---------------- Leadership, student teams & competitions ---------------- */
  {
    id: 'med-t-leadership',
    group: 'leadership',
    org: 'McMaster MED-T',
    title: 'System Control Subteam Lead',
    location: 'Hamilton, Ontario',
    dates: 'Apr 2026 – present',
    start: '2026-04',
    seeAlso: 'med-t',
    summary: 'Running the system-control subteam: requirements, recruiting, hardware and integration with the other subteams.',
    contributions: [
      'Coordinate system-control requirements and technical milestones.',
      'Interview and onboard new members.',
      'Manage electronics inventory and restore hardware.',
      'Integrate and test across subteams.',
    ],
    tech: ['Team leadership & recruiting', 'Project management'],
  },
  {
    id: 'ibiomed-showcase',
    group: 'leadership',
    org: 'McMaster iBioMed Final Design Showcase',
    title: 'Presenter',
    location: 'Hamilton, Ontario',
    dates: '2025',
    start: '2025-04',
    summary: 'Presented Cycle Buddy, a blind-spot detection helmet for a cyclist with reduced peripheral vision.',
    tech: ['Technical presentation'],
    projects: ['cycle-buddy'],
  },
  {
    id: 'medsprint',
    group: 'leadership',
    org: 'MedSprint',
    title: 'Participant',
    location: TODO_USER_CONTENT,
    dates: 'Mar 2025',
    start: '2025-03',
    summary:
      'Presented assistive smart glasses for a patient with hearing difficulties: a microphone, speakers and bone-conduction audio, plus a camera algorithm that detects hand gestures and displays text on the lens. I led the CAD design and the gesture-detection algorithm; the team’s working prototype was demonstrated live.',
    outcome: 'Working prototype demonstrated live at the presentation.',
    tech: ['CAD', 'Human-centered design', 'Technical presentation'],
    media: [
      {
        kind: 'image',
        src: '/media/experience/medsprint/smart-glasses-cad.webp',
        width: 1200,
        height: 655,
        alt: 'CAD render of the smart-glasses frame: round lenses, a small camera at the bridge, electronics bays along one arm and an attached microphone.',
        caption: 'CAD model of the smart glasses.',
      },
    ],
    todo: ['Location'],
  },
  {
    id: 'first-robotics',
    group: 'leadership',
    org: 'FIRST Robotics — Cathedral High School',
    title: 'Software Lead',
    location: 'Hamilton, Ontario',
    dates: TODO_USER_CONTENT,
    start: '2024-01',
    summary: 'Led software for the school’s FIRST Robotics team. Recognized with a FIRST Robotics Award.',
    tech: ['Team leadership & recruiting'],
    todo: ['Dates, robot, programming stack, competitions'],
  },
  {
    id: 'gael-guides',
    group: 'leadership',
    org: 'Gael Guides Leadership Group — Cathedral High School',
    title: 'President / Chair',
    location: 'Hamilton, Ontario',
    dates: TODO_USER_CONTENT,
    start: '2024-01',
    summary: 'President and chair of the school’s student leadership group, focused on leadership development and community and service initiatives.',
    todo: ['Dates, responsibilities, impact'],
  },

  /* ---------------- Other professional experience ---------------- */
  {
    id: 'french-camp',
    group: 'other',
    org: 'Les Petites Pommes French Camp',
    title: 'Counsellor',
    location: TODO_USER_CONTENT,
    dates: 'Aug 2025',
    start: '2025-08',
    summary: 'Planned and led activities, French-language games and worksheets, running group learning entirely in French.',
  },
  {
    id: 'hgcc',
    group: 'other',
    org: 'Hamilton Golf & Country Club',
    title: 'Bartender / Server',
    location: 'Hamilton area, Ontario',
    dates: 'Apr 2025 – present',
    start: '2025-04',
    summary: 'High-volume hospitality service: handling member requests accurately and quickly while working closely with the team.',
  },
  {
    id: 'shakespeares',
    group: 'other',
    org: 'Shakespeare’s Steak & Seafood',
    title: 'Server · Bartender · Kitchen Help · Busser',
    location: TODO_USER_CONTENT,
    dates: 'Nov 2019 – present',
    start: '2019-11',
    summary:
      'Progressed from busser and kitchen help to bartender and server at the same restaurant since 2019, across dinner-service operations.',
    contributions: [
      'Guest service and dinner-service operations.',
      'Kitchen and server support; setting up and turning around the dining room.',
    ],
    todo: ['Confirm location (Hamilton?)'],
  },
];

export const experienceGroupLabels: Record<ExperienceGroup, string> = {
  technical: 'Technical / Professional',
  leadership: 'Student Teams & Leadership',
  other: 'Additional Employment',
};

export const experienceGroupOrder: ExperienceGroup[] = ['technical', 'leadership', 'other'];

export function experienceInGroup(g: ExperienceGroup): ExperienceEntry[] {
  return experience.filter((e) => e.group === g).sort((a, b) => b.start.localeCompare(a.start));
}

export function getExperience(id: string): ExperienceEntry | undefined {
  return experience.find((e) => e.id === id);
}

/** The Experience hub. */
export const EXPERIENCE_HUB = '/lab/experience';

/** Anchor id of an entry's row or card on the hub. */
export const roleAnchor = (id: string) => `role-${id}`;

/** Has enough depth for its own /experience/:id page. */
export const hasExperiencePage = (e: ExperienceEntry) =>
  !!(e.initiatives?.length || (e.contributions?.length && e.projects?.length));

/**
 * Where a link to this entry should go: its own page; for a leadership entry
 * that extends a technical role, that role's page; otherwise its row on the hub.
 */
export function experienceHref(e: ExperienceEntry): string {
  if (hasExperiencePage(e)) return `/experience/${e.id}`;
  const parent = e.seeAlso ? getExperience(e.seeAlso) : undefined;
  if (parent && hasExperiencePage(parent)) return `/experience/${parent.id}`;
  return `${EXPERIENCE_HUB}#${roleAnchor(e.id)}`;
}
