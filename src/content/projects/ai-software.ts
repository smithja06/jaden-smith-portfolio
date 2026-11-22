import { TODO_USER_CONTENT, type Project } from '../types';

/**
 * AI & Software Systems — inventory P01–P08.
 *
 * RBC records (P01–P06) are `listing: 'private'`: they are professional
 * Experience, not public projects, so they never appear in the Projects hub,
 * search, filters, related links or the Skills explorer's project lists.
 * They stay here as the detailed source behind the RBC experience entry.
 * The descriptions and figures are approved for public discussion; RBC code,
 * repositories, screenshots, reports and production data are NOT — keep
 * `restricted: true` and leave `evidence` empty.
 */
export const aiSoftwareProjects: Project[] = [
  {
    id: 'rbc-payment-routing-simulation',
    listing: 'private',
    inventory: 1,
    title: 'Payment Routing Simulation & Explainability',
    summary:
      'Simulation, tracing and explainability tools for checking an enterprise payment-routing engine against production outcomes.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'in-progress',
    ownership: 'major',
    ownershipNote:
      'I built the simulator, rule tracker, discrepancy tracker, per-payment trace debugger, explainability view and the payment visualizations. The Java / Spring Boot routing engine itself is a team effort.',
    tech: ['Java', 'Spring Boot', 'Three.js', 'IBM MQ', 'Microsoft Entra ID'],
    highlights: ['~99.9% rule-exit agreement across 15,000+ evaluated payments', '100+ routing discrepancies resolved'],
    metrics: [
      { value: '~99.9%', label: 'rule-exit agreement', note: 'Comparative testing against production results across 15,000+ evaluated payments — a validation figure, not a production rollout.' },
      { value: '15,000+', label: 'payments evaluated' },
      { value: '100+', label: 'discrepancies investigated and resolved' },
    ],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-legacy-rules-reconstruction', 'rbc-agent-readiness-framework'],
    plannedSimulation: 'Public-safe routing visualization driven by synthetic payments (no RBC data or rules).',
    caseStudy: {
      problem: [
        'A payment-routing engine decides, rule by rule, where each payment goes. When that logic is rebuilt, the team needs to know that every payment exits the rules the same way the existing system would — and, when it doesn’t, exactly why.',
        'That calls for tools that can replay payments, show which rules fired and in what order, and make the differences between expected and actual results easy to investigate.',
      ],
      contributions: [
        'Built the payment simulator for replaying payments through the routing rules.',
        'Built a rule tracker and a discrepancy tracker that flag where the engine’s decision differs from the expected result.',
        'Built a per-payment trace debugger and an explainability view that breaks down how the rules engine evaluated and decided each payment.',
        'Built a Three.js payments globe with a sign-in screen and animated simulated payment flows, plus an interactive 2D world map for the same simulations.',
        'Investigated and resolved more than 100 discrepancies between the engine’s logic and expected results.',
      ],
      team: [
        'The routing engine and platform (Java, Spring Boot) are built by the wider team. My work sits around it: the tools that simulate, trace, explain and validate its decisions.',
      ],
      architecture: {
        caption: 'Public-level view of the validation loop. No internal system names, rules or data are shown.',
        nodes: [
          { id: 'in', label: 'Payment replay', detail: 'Payments fed through the simulator.' },
          { id: 'engine', label: 'Routing engine', detail: 'Team-built Java / Spring Boot rules engine.' },
          { id: 'trace', label: 'Rule trace', detail: 'Every rule evaluated, in order, for one payment.' },
          { id: 'diff', label: 'Discrepancy tracker', detail: 'Compares the exit rule with the expected result.' },
          { id: 'explain', label: 'Explainability UI', detail: 'Why this payment went where it did.' },
        ],
      },
      validation: [
        'In comparative testing against production results, the engine reached roughly 99.9% rule-exit agreement across more than 9,500 evaluated payments.',
        'This measures agreement between the rebuilt engine and production outcomes. It is not a claim that the replacement has been deployed to production.',
      ],
      limitations: [
        'IBM MQ integration and Microsoft Entra ID sign-in are in progress, not complete.',
        'No RBC code, screenshots or data can be shared; any future visuals here will be original, synthetic illustrations.',
      ],
    },
    todo: ['Validation methodology: sampling criteria, dates and limits of the agreement figure', 'Motivation, key decisions and lessons'],
  },
  {
    id: 'rbc-legacy-rules-reconstruction',
    listing: 'private',
    inventory: 2,
    title: 'Legacy Banking Rules Application Reconstruction',
    summary:
      'Reverse-engineered a compiled legacy banking application and rebuilt its feature set, verified feature by feature against the original.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'validated',
    ownership: 'sole',
    ownershipNote: 'I was the only person working on the reverse engineering and every feature that followed.',
    tech: [],
    highlights: ['379 of 399 legacy features verified', 'Supports 5,000+ rules'],
    metrics: [
      { value: '379 / 399', label: 'legacy features verified', note: 'Feature-by-feature comparison against the legacy application, performed personally.' },
      { value: '5,000+', label: 'rules traced and managed' },
    ],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-payment-routing-simulation'],
    caseStudy: {
      problem: [
        'A business-critical rules application existed only as compiled software. To maintain or replace it, its behaviour had to be recovered from the program itself.',
      ],
      contributions: [
        'Reverse-engineered the compiled application to recover how it behaves.',
        'Rebuilt its feature set: rule tracing and management across more than 5,000 rules, rule uploads, and automated generation of correspondent files.',
        'Tested the rebuilt features against the legacy behaviour myself.',
      ],
      future: ['SSO sign-in for the rebuilt application is in progress.'],
      validation: ['379 of 399 legacy features have been verified against the original application.'],
      limitations: ['No source, screenshots or exports can be shared.'],
    },
    todo: ['Which 20 features remain and why', 'Sanitized illustration'],
  },
  {
    id: 'rbc-agent-readiness-framework',
    listing: 'private',
    inventory: 3,
    title: 'AI Agent Readiness Framework',
    summary:
      'An assessment framework that scores how ready a code repository is for AI agents, with dashboards and remediation guidance.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'validated',
    ownership: 'sole',
    ownershipNote: 'I designed the framework and built its automated assessments, agents and workflows.',
    tech: ['AI agents', 'Devin Cloud', 'Agent Skills', 'AI maturity assessment', 'Data visualization & dashboards'],
    highlights: ['100+ repositories audited', '~85% less assessment time'],
    metrics: [
      { value: '10 · 81 · 5', label: 'pillars · criteria · maturity levels' },
      { value: '100+', label: 'repositories audited' },
      { value: '~85%', label: 'reduction in assessment time', note: 'From my own testing and comparison with manual assessment.' },
    ],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-engineering-agents', 'rbc-ai-adoption-analytics'],
    caseStudy: {
      problem: [
        'AI coding agents work well in some repositories and poorly in others. Teams needed a consistent way to tell which, why, and what to fix first.',
      ],
      contributions: [
        'Designed the framework: 10 pillars, 81 criteria and 5 maturity levels.',
        'Built automated assessments that produce findings, historical readiness tracking, HTML dashboards and remediation guidance.',
        'Built the Devin Cloud agents that run the audits (see AI Agents for Engineering Workflows).',
      ],
      architecture: {
        caption: 'How a repository moves through an assessment.',
        nodes: [
          { id: 'repo', label: 'Repository', detail: 'Code, configuration and documentation.' },
          { id: 'audit', label: 'Agent audit', detail: 'Automated checks against 81 criteria.' },
          { id: 'score', label: 'Maturity level', detail: 'Scored across 10 pillars into 5 levels.' },
          { id: 'out', label: 'Dashboards & fixes', detail: 'History, findings and remediation steps.' },
        ],
      },
      validation: [
        'Used to audit more than 100 repositories.',
        'Automation cut assessment time by roughly 85% compared with assessing by hand, based on my own testing.',
      ],
      limitations: ['No internal dashboards or reports can be shared.'],
    },
    todo: ['Original, sanitized diagram of the 10 pillars', 'Methodology for the time-saving figure'],
  },
  {
    id: 'rbc-ai-sdlc-observability',
    listing: 'private',
    inventory: 4,
    title: 'AI SDLC Observability (Spec Kit Instrumentation)',
    summary:
      'A Spec Kit extension that measures token use, cost and duration across the phases of AI-assisted software development.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'employer',
    tech: ['Spec Kit', 'Google Analytics 4', 'AI agents'],
    highlights: ['16 lifecycle hooks across 8 SDLC phases'],
    metrics: [{ value: '16 · 8', label: 'lifecycle hooks · AI SDLC phases' }],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-ai-adoption-analytics'],
    caseStudy: {
      problem: ['To improve AI-assisted development, teams first need to see where the tokens, cost and time actually go.'],
      implementation: [
        'The extension hooks into 16 points across 8 phases of the AI software-development lifecycle and records token usage, cost and duration, reported through Google Analytics 4.',
        'It also writes a JSON history of the whole development process and generates an HTML report showing every metric, broken down per user story and per Spec Kit phase.',
        'Alongside this, I facilitated courses on spec-driven development within the organization.',
      ],
    },
    todo: ['Confirm my individual ownership of the extension before describing it as mine', 'Adoption outcomes'],
  },
  {
    id: 'rbc-ai-adoption-analytics',
    listing: 'private',
    inventory: 5,
    title: 'AI Adoption Analytics',
    summary:
      'Organization-wide analysis of AI adoption across more than 15,000 repositories, summarized into tiers and organizational levels.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'employer',
    ownership: 'contributor',
    ownershipNote:
      'The portal (FastAPI, React, TypeScript, MongoDB) is a team build. My part was the organizational analysis: scanning repositories, gathering technical information and breaking down the findings — plus teaching spec-driven development.',
    tech: ['Technical teaching'],
    highlights: ['15,000+ repositories analyzed by the portal'],
    metrics: [
      { value: '15,000+', label: 'repositories analyzed', note: 'Scope of the team-built portal.' },
      { value: '6 → 4', label: 'adoption tiers → organizational levels' },
    ],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-agent-readiness-framework', 'rbc-ai-sdlc-observability'],
    caseStudy: {
      problem: ['Leadership needed a clear picture of how AI tools were actually being adopted across a very large engineering organization.'],
      contributions: [
        'Scanned repositories and gathered technical information on AI adoption.',
        'Prepared breakdowns and interpretations of the results for the organizational analysis.',
        'Facilitated spec-driven development courses for engineers.',
      ],
      team: ['The portal itself — a FastAPI backend, React / TypeScript frontend and MongoDB store that grades adoption in 6 tiers and rolls them up into 4 organizational levels — was built by the team.'],
    },
  },
  {
    id: 'rbc-engineering-agents',
    listing: 'private',
    inventory: 6,
    title: 'AI Agents for Engineering Workflows',
    summary:
      'Devin Cloud agents that automate repository audits, failure triage, vulnerability remediation, requirements analysis and architecture documentation.',
    context: 'RBC · AI / ML Engineer Co-op',
    dates: 'Sep 2026 – present',
    category: 'ai-software',
    status: 'validated',
    ownership: 'sole',
    ownershipNote: 'I built these agents and automations on my own.',
    tech: ['Devin Cloud', 'AI agents', 'Agent Skills'],
    highlights: ['Powers the Agent Readiness audits'],
    restricted: true,
    experience: ['rbc'],
    related: ['rbc-agent-readiness-framework'],
    caseStudy: {
      contributions: [
        'Repository audits that feed the Agent Readiness framework.',
        'Workflows for failure triage, vulnerability remediation, requirements analysis and architecture documentation.',
        'All of these run as Devin Cloud automations, not by hand.',
      ],
      outcomes: ['These agents run the 100+ repository audits counted under the Agent Readiness framework; they are the same work, not an additional result.'],
    },
  },
  {
    id: 'custodyos',
    listing: 'case-study',
    coreTech: ['React', 'FastAPI', 'MongoDB Atlas', 'TypeScript', 'Voice agents (ElevenLabs)'],
    inventory: 7,
    title: 'custodyOS — AI Chain-of-Custody Platform',
    summary:
      'A forensic-lab custody platform with an append-only ledger, natural-language queries and voice-agent oversight, built at the MongoDB Hackathon.',
    context: 'MongoDB Hackathon 2026 · team project',
    dates: '2026',
    category: 'ai-software',
    status: 'hackathon',
    ownership: 'major',
    ownershipNote:
      'I built the entire frontend, the interactive custody simulator and all of the ElevenLabs voice-agent controls, contributed to the RAG engine, and helped enforce append-only access to the audit ledger. Teammates built most of the backend and the Atlas Vector Search setup.',
    tech: ['React', 'TypeScript', 'Python', 'FastAPI', 'MongoDB Atlas', 'Atlas Vector Search', 'RAG', 'Voice agents (ElevenLabs)', 'AI agents'],
    highlights: ['End-to-end custody workflow working in the live demo', '43 API endpoints operational'],
    metrics: [
      { value: '43', label: 'API endpoints working in the demo', note: 'Team total during the hackathon demonstration.' },
      { value: '1,024', label: 'embedding dimensions', detail: true },
    ],
    art: 'custody',
    evidence: { repo: 'https://github.com/smithja06/custody-os-mongodb-hackathon', demo: TODO_USER_CONTENT, video: TODO_USER_CONTENT },
    media: [
      {
        kind: 'image',
        placement: 'hero',
        src: '/media/projects/custodyos/control-center.webp',
        width: 1920,
        height: 936,
        alt: 'The custodyOS Control Center mid-transfer: a request to move sample TS-1042 from Freezer B to Sequencing Station 3, the route drawn on a map of the lab and paused as Blocked, a "Confirm this transfer" panel reading the request aloud before anything irreversible happens, and an activity log of the agent’s checked steps.',
      },
      {
        kind: 'video',
        placement: 'results',
        src: '/media/projects/custodyos/demo.mp4',
        poster: '/media/projects/custodyos/demo-poster.webp',
        width: 1920,
        height: 1080,
        title: 'custodyOS — Demo walkthrough',
        alt: 'One-minute walkthrough of custodyOS: a voice request to move a lab sample, policy checks and confirmation, scanner-verified hand-offs, a supervisor approving restricted evidence, revoking the agent’s grant mid-move, recovery, and querying the audit ledger.',
      },
    ],
    caseStudy: {
      built: [
        'Built the entire frontend, including the interactive custody simulator.',
        'Built all of the voice-agent controls.',
        'Contributed to the RAG engine behind natural-language custody queries.',
        'Helped enforce append-only access to the audit ledger.',
      ],
      problem: [
        'In forensic and biological labs, every hand-off of a sample has to be recorded and auditable. Paper trails and ad-hoc spreadsheets make it hard to see who had what, when — and easy for records to be altered.',
      ],
      contributions: [
        'Built the entire React / TypeScript frontend.',
        'Built the interactive custody simulator used to walk through hand-offs, revocations and restorations.',
        'Built all of the ElevenLabs voice-agent controls.',
        'Contributed to the RAG engine that answers natural-language custody questions.',
        'Helped enforce append-only (write-only) access to the audit ledger in MongoDB.',
      ],
      covered: ['contributions'],
      team: ['Most of the backend infrastructure and the MongoDB Atlas Vector Search implementation were built by teammates.'],
      architecture: {
        caption: 'How a custody event flows through the system.',
        nodes: [
          { id: 'ui', label: 'React interface', detail: 'Custody simulator, dashboards and voice controls.' },
          { id: 'api', label: 'FastAPI', detail: 'Python API — 43 endpoints in the demo.' },
          { id: 'ledger', label: 'Atlas ledger', detail: 'Append-only custody record in MongoDB Atlas.' },
          { id: 'rag', label: 'RAG + vector search', detail: '1,024-dimension embeddings for natural-language queries.' },
          { id: 'agent', label: 'Voice agent', detail: 'ElevenLabs agent that can intervene in a workflow.' },
        ],
      },
      validation: [
        'In the hackathon demo, the end-to-end custody workflow worked — including revoking and restoring access — along with natural-language custody queries and agent interventions.',
      ],
      limitations: ['Built in a hackathon timeframe; it is a working demonstration, not a deployed lab system.'],
    },
    todo: ['Repo, demo and video URLs', 'Team members and placement', 'Screenshots / pitch clip', 'Motivation and lessons'],
  },
  {
    id: 'bmett-acl-movement-classification',
    listing: 'module',
    inventory: 8,
    title: 'ACL Rehabilitation Movement Classification',
    summary:
      'A machine-learning pipeline that classifies movement from EMG and IMU data to derive range-of-motion, force and muscle-activation features for rehab.',
    context: 'McMaster BMETT · team project',
    dates: TODO_USER_CONTENT,
    category: 'ai-software',
    status: 'prototype',
    ownership: 'team',
    tech: ['Machine learning', 'EMG', 'IMU & magnetometer', 'Sensor feature extraction'],
    highlights: ['Tested on live sensor input'],
    experience: ['bmett'],
    parent: 'bmett-acl-rehabilitation',
    related: ['bmett-acl-rehabilitation'],
    caseStudy: {
      problem: ['Rehabilitation progress depends on features such as range of motion, force and muscle activation — values that have to be extracted from noisy wearable data.'],
      validation: ['The ML system was tested on live sensor input streamed over BLE. No accuracy figures are published yet.'],
      limitations: ['A student prototype, not a clinically validated tool.'],
      covered: ['validation', 'limitations'],
    },
    todo: ['Models used, training data, accuracy', 'My exact contribution to the model', 'Do not publish the confusion-matrix counts until verified'],
  },
];
