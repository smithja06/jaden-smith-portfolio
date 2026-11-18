import { TODO_USER_CONTENT, type Category, type Project } from './types';

export const categoryLabels: Record<Category, string> = {
  'ai-software': 'AI / Software',
  embedded: 'Embedded',
  biomedical: 'Biomedical',
  creative: 'Creative',
};

/**
 * Add a project here and it automatically appears on /work, in its filters,
 * and at /work/:slug. Set `featuredOrder` to curate it onto the homepage.
 */
export const projects: Project[] = [
  {
    slug: 'med-t-sensory-substitution',
    title: 'MED-T Sensory Substitution',
    summary: 'Turning what a camera sees into something a person can feel — via a small 4×4 output grid.',
    cardText:
      'A sensory-substitution prototype that reduces image brightness to a handful of states and drives an ESP32-controlled 4×4 LED grid, as a stand-in for tactile feedback.',
    categories: ['embedded', 'biomedical'],
    tags: ['Image processing', 'ESP32', '4×4 output'],
    status: 'prototype',
    role: 'System control — team project',
    timeline: TODO_USER_CONTENT,
    stack: ['Image processing', 'ESP32', 'Serial communication', 'LED matrix'],
    links: [],
    art: 'medt',
    conceptVisual: true,
    featuredOrder: 1,
    labLink: { label: 'Try the 4×4 experiment', to: '/lab/vision-matrix' },
    caseStudy: {
      problem: [
        'Sensory substitution asks a simple, hard question: can information normally carried by one sense be delivered through another? For vision, that means compressing a rich image into something a body can actually perceive.',
        'The constraint is brutal. A tactile or light-based display has very few “pixels”, so the interesting engineering is deciding what to keep.',
      ],
      role: [
        'This was a team project. My involvement was on the system-control side: the path from image-derived states to the microcontroller that drives the output grid.',
        'Other parts of the system — mechanical design, broader image pipeline choices, user research — were shared across the team.',
      ],
      system: {
        caption: 'Simplified public-level pipeline. Each stage hands a smaller, more decisive representation to the next.',
        nodes: [
          { id: 'cam', label: 'Image frame', detail: 'A frame from the camera input.' },
          { id: 'reduce', label: 'Brightness field', detail: 'Frame reduced to a 4×4 grid of brightness values.' },
          { id: 'state', label: 'State mapping', detail: 'Each cell classified into a small number of discrete levels.' },
          { id: 'serial', label: 'Serial payload', detail: 'Compact state sent from the host to the microcontroller.' },
          { id: 'esp', label: 'ESP32 → 4×4 grid', detail: 'Firmware sets each output cell’s intensity.' },
        ],
      },
      decisions: [
        {
          title: 'Few states beat many',
          body: 'With only sixteen output cells, discrete levels are easier to perceive and easier to debug than a continuous value per cell. The grid stays 4×4 on purpose.',
        },
        {
          title: 'Do the heavy lifting off-device',
          body: 'Image work happens on the host; the microcontroller receives an already-reduced state. That keeps firmware simple and the serial message small.',
        },
        {
          title: 'Stability over twitchiness',
          body: 'Raw brightness flickers. Ramping output toward new states, rather than jumping, makes the display calmer and easier to read.',
        },
      ],
      implementation: [
        'The interactive lab on this site reproduces the core idea in the browser: a 4×4 brightness field, a threshold or four-level quantizer, and an illuminated output grid with an optional ramp. It is a simplified teaching model, not the project’s actual code.',
      ],
      outcome: [
        'MED-T is a prototype. It demonstrates the pipeline end-to-end on a small grid; it is not a medical device and makes no clinical claims.',
        'Natural next steps are moving from LEDs to tactile actuators, testing how quickly people learn the mapping, and exploring smarter reductions than brightness alone.',
      ],
      contentNote: 'Photos, exact dates and team credits will be added once confirmed.',
    },
  },
  {
    slug: 'ai-developer-tooling',
    title: 'AI Developer Tooling',
    summary: 'Professional work on developer tooling and AI-assisted engineering workflows.',
    cardText:
      'Co-op work at RBC on tools that support engineers day to day, with a focus on developer experience and practical AI assistance. Discussed at a public, non-confidential level.',
    categories: ['ai-software'],
    tags: ['Developer experience', 'AI workflows', 'Tooling'],
    status: 'professional work',
    role: 'AI / Software Developer (Co-op), RBC',
    timeline: TODO_USER_CONTENT,
    stack: TODO_USER_CONTENT,
    links: [],
    art: 'tooling',
    conceptVisual: true,
    featuredOrder: 2,
    caseStudy: {
      problem: [
        'Engineering teams lose a surprising amount of time to friction: context switching, repetitive setup, and hunting for the right information. Good tooling removes that friction without asking people to change how they think.',
      ],
      role: [
        'I worked as a co-op developer within a larger engineering organization. The work was collaborative; specific systems, internal names and data are intentionally not described here.',
      ],
      system: {
        caption: 'Generic shape of an AI-assisted developer workflow. Not a depiction of any internal system.',
        nodes: [
          { id: 'dev', label: 'Engineer', detail: 'Starts with a task in their normal environment.' },
          { id: 'tool', label: 'Tooling layer', detail: 'Gathers the relevant context for the task.' },
          { id: 'ai', label: 'AI assistance', detail: 'Suggests, drafts or explains — with a human in the loop.' },
          { id: 'review', label: 'Review', detail: 'The engineer stays in control of what ships.' },
        ],
      },
      decisions: [
        {
          title: 'Fit the existing workflow',
          body: 'Tools that live where engineers already work get used; tools that demand a new habit usually don’t.',
        },
        {
          title: 'Keep humans in the loop',
          body: 'AI output is treated as a draft to review, never as an unattended action.',
        },
      ],
      implementation: [
        'Implementation details, screenshots and internal results are omitted to respect confidentiality.',
      ],
      outcome: [
        'The main takeaway was how much developer experience is about trust: clear, predictable tools beat clever ones.',
      ],
      contentNote: 'Pending review: this description stays at a public level until any further detail is approved for publication.',
    },
  },
  {
    slug: 'bmett-acl-rehabilitation',
    title: 'BMETT — ACL Rehabilitation Technology',
    summary: 'Exploring how wearable sensing and software could support ACL rehabilitation.',
    cardText:
      'A team project investigating EMG and IMU sensing for knee rehabilitation, with a data pipeline and a companion mobile-app concept for tracking progress.',
    categories: ['biomedical', 'ai-software', 'embedded'],
    tags: ['EMG / IMU', 'ML pipeline', 'App concept'],
    status: 'student project',
    role: 'Software — team project',
    timeline: TODO_USER_CONTENT,
    stack: ['EMG', 'IMU', 'Machine learning', 'Mobile app concept'],
    links: [],
    art: 'bmett',
    conceptVisual: true,
    featuredOrder: 3,
    labLink: { label: 'Play with signal filtering', to: '/lab/signal-playground' },
    caseStudy: {
      problem: [
        'Recovery from an ACL injury is long, and much of it happens away from the clinic. Patients and clinicians have limited visibility into how exercises are actually being performed between visits.',
      ],
      role: [
        'I contributed on the software side of a multidisciplinary student team. Hardware, biomechanics and clinical framing were shared across members.',
      ],
      system: {
        caption: 'Conceptual pipeline from body-worn sensing to feedback.',
        nodes: [
          { id: 'sense', label: 'EMG + IMU', detail: 'Muscle activity and motion captured from wearable sensors.' },
          { id: 'clean', label: 'Signal processing', detail: 'Filtering and segmentation of raw sensor streams.' },
          { id: 'ml', label: 'ML model', detail: 'Explores classifying movement quality or exercise phases.' },
          { id: 'app', label: 'App / dashboard', detail: 'Concept for presenting progress to patient and clinician.' },
        ],
      },
      decisions: [
        {
          title: 'Combine complementary signals',
          body: 'EMG describes what muscles are doing; IMU describes how the limb moves. Together they tell a fuller story than either alone.',
        },
        {
          title: 'Clean before you classify',
          body: 'Wearable signals are noisy. Investing in filtering and segmentation first makes any downstream model easier to trust.',
        },
      ],
      implementation: [
        'The mobile app and dashboards are at the concept stage; sensing and pipeline components were the main focus of prototyping.',
      ],
      outcome: [
        'This is a student project, not a validated clinical tool. No accuracy or patient-outcome claims are made.',
      ],
      contentNote: 'Specific pipeline details, visuals and dates to be added once confirmed.',
    },
  },
  {
    slug: 'brthday-interactive-commerce',
    title: 'brthday — Interactive Commerce',
    summary: 'A clothing collection you browse like a physical rack, not a product grid.',
    cardText:
      'A creative front-end project that presents a clothing collection through an interactive rack interface — a deliberate break from the standard e-commerce grid.',
    categories: ['creative', 'ai-software'],
    tags: ['Interaction design', 'Front-end', 'Full-stack'],
    status: 'student project',
    role: TODO_USER_CONTENT,
    timeline: TODO_USER_CONTENT,
    stack: TODO_USER_CONTENT,
    links: [],
    art: 'brthday',
    conceptVisual: true,
    featuredOrder: 4,
    caseStudy: {
      problem: [
        'Most online stores look the same: a grid of thumbnails. That works for search, but it loses the feeling of browsing a collection in person.',
      ],
      role: [
        'Design and front-end engineering of the collection interface. Exact scope and collaborators to be confirmed.',
      ],
      system: {
        caption: 'High-level shape of the experience.',
        nodes: [
          { id: 'catalog', label: 'Collection data', detail: 'Pieces in the collection and their details.' },
          { id: 'rack', label: 'Interactive rack', detail: 'Items presented as hangers you move through.' },
          { id: 'detail', label: 'Item detail', detail: 'Focused view of a single piece.' },
        ],
      },
      decisions: [
        {
          title: 'Metaphor first',
          body: 'The rack metaphor drives the interaction: sliding through items should feel physical and unhurried.',
        },
        {
          title: 'Keep it usable',
          body: 'Playful interfaces still need clear focus states, readable product information and a fast path to details.',
        },
      ],
      implementation: ['Screenshots and implementation notes will be added.'],
      outcome: [
        'brthday shows range outside research engineering — interaction design and visual craft applied to commerce.',
      ],
      contentNote: 'Screenshots, links, stack and timeline pending.',
    },
  },
  {
    slug: 'spinealign-posture-feedback',
    title: 'SpineAlign — Posture Feedback',
    summary: 'A wearable prototype that senses posture and nudges you back toward alignment.',
    cardText:
      'An engineering design prototype using IMU sensing to estimate posture and deliver physical feedback when alignment drifts.',
    categories: ['embedded', 'biomedical'],
    tags: ['Wearable', 'IMU', 'Actuation'],
    status: 'prototype',
    role: TODO_USER_CONTENT,
    timeline: TODO_USER_CONTENT,
    stack: ['IMU', 'Microcontroller', 'Haptic / actuator feedback'],
    links: [],
    art: 'spinealign',
    conceptVisual: true,
    caseStudy: {
      problem: [
        'Poor posture builds up slowly and invisibly. By the time it hurts, the habit is set. A gentle, timely cue could help people notice sooner.',
      ],
      role: ['Engineering design project. Exact role and team composition to be confirmed.'],
      system: {
        caption: 'Sense → estimate → respond loop.',
        nodes: [
          { id: 'imu', label: 'IMU sensing', detail: 'Orientation data from body-worn sensors.' },
          { id: 'est', label: 'Posture estimate', detail: 'Compare current orientation against a reference.' },
          { id: 'fb', label: 'Feedback', detail: 'Physical cue when posture drifts past a tolerance.' },
        ],
      },
      decisions: [
        {
          title: 'Tolerance, not perfection',
          body: 'Constant alerts get ignored. Feedback should trigger only on sustained drift beyond a comfortable band.',
        },
        {
          title: 'Physical over visual',
          body: 'A subtle physical cue reaches the user without requiring them to look at a screen.',
        },
      ],
      implementation: ['Hardware photos and implementation notes will be added.'],
      outcome: ['SpineAlign is a prototype from an engineering design context; it is not a medical device.'],
      contentNote: 'Role, photos and details pending.',
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects(limit = 4): Project[] {
  return projects
    .filter((p) => p.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .slice(0, limit);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
