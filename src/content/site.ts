import { TODO_USER_CONTENT, type Maybe } from './types';

export interface SocialLink {
  label: string;
  /** Full https:// URL. Hidden while TODO. */
  href: Maybe<string>;
}

export interface SiteConfig {
  name: string;
  initials: string;
  descriptor: string;
  /** Public base URL used for canonical/OG tags once deployed. */
  baseUrl: Maybe<string>;
  email: Maybe<string>;
  /** Path to a real PDF in /public, e.g. "/resume.pdf". Hidden until provided. */
  resumeUrl: Maybe<string>;
  /** Filename the browser saves the résumé as. */
  resumeFilename: string;
  /** Profiles. Each stays hidden until its href is a real URL. */
  socials: SocialLink[];
  /** Short role line shown next to the name in the header. */
  role: string;
  /** Portrait in /public (WebP with a JPEG fallback alongside). */
  headshot: { webp: string; jpg: string; alt: string };
  hero: {
    eyebrow: string;
    /** One memorable line under the name. */
    statement: string;
    description: string;
  };
  /** Homepage About section (2–3 sentences). Keep every claim factual. */
  about: string[];
  /** Longer biography for /about. Extend in your own words. */
  bio: string[];
  /** Areas of focus, each tied to real work. `label`/`hint` feed the About-page signal field. */
  focusAreas: { title: string; body: string; label: string; hint: string }[];
  contactLead: string;
}

export const site: SiteConfig = {
  name: 'Jaden Smith',
  initials: 'JS',
  descriptor: 'Software, AI & embedded systems',
  baseUrl: TODO_USER_CONTENT,
  email: 'smithja741@icloud.com',
  resumeUrl: '/Jaden-Smith-Resume.pdf',
  resumeFilename: 'Jaden Smith - Resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/smithja06' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jaden-smith-577325267/' },
  ],
  role: 'Software · AI · Embedded',
  headshot: { webp: '/jaden-headshot.webp', jpg: '/jaden-headshot.jpg', alt: 'Portrait of Jaden Smith' },
  hero: {
    eyebrow: 'Electrical & Biomedical Engineering — McMaster University',
    statement: 'Building software, intelligent systems and hardware for real-world problems.',
    description:
      'Currently an AI / Machine Learning Engineer co-op at RBC, and system-control lead on McMaster’s MED-T design team.',
  },
  about: [
    'I study Electrical and Biomedical Engineering in McMaster’s iBioMed program and am spending this year as an AI / Machine Learning Engineer co-op at RBC.',
    'I’ve always loved solving problems with solutions you can’t just look up, and engineering lets me do that across software and hardware at once. Working with real patients in iBioMed made it personal: using what I’d learned to help with someone’s everyday challenges was the most rewarding thing I’ve done, and it’s what I want to keep building toward.',
  ],
  bio: [
    'I study Electrical and Biomedical Engineering in McMaster University’s iBioMed program and build across software, AI and physical systems — from embedded computer vision and rehabilitation prototypes to full-stack applications and agentic tooling.',
    'I’ve always loved solving problems with answers you can’t find by searching online, and engineering lets me do that across software and hardware at once. That became personal in iBioMed, where I worked with patients facing hard challenges in their day-to-day lives. Applying what I’d learned to actually help someone was the most fulfilling thing I’ve done, and I want to keep building technology that changes how people facing medical, social or any other kind of challenge live.',
    'The thread runs from early Swift and robotics work, through human-centered devices on student design teams, to professional software and AI engineering at RBC.',
  ],
  focusAreas: [
    {
      title: 'AI & software systems',
      label: 'Software & AI',
      hint: 'Validation tooling and AI agents at RBC',
      body: 'Validation and explainability tools, agent-readiness frameworks and AI agents at RBC; a RAG-backed custody platform at the MongoDB Hackathon.',
    },
    {
      title: 'Embedded & sensor systems',
      label: 'Embedded & hardware',
      hint: 'ESP32 firmware and on-device vision',
      body: 'ESP32 firmware, multiplexed output arrays, IMU filtering and on-device vision — chosen by benchmarking on the target hardware.',
    },
    {
      title: 'Biomedical & human-centered design',
      label: 'Human-centered',
      hint: 'Assistive and rehabilitation devices',
      body: 'Sensory substitution, ACL rehabilitation monitoring, posture feedback and a blind-spot helmet, each designed around a real user.',
    },
    {
      title: 'Interfaces & creative engineering',
      label: 'Interfaces',
      hint: 'Dashboards, a storefront and this lab',
      body: 'Clinician dashboards, an interactive clothing-rack storefront and this 3D lab — interfaces that explain the system behind them.',
    },
  ],
  contactLead: 'Have an idea worth building? I’m open to conversations about software, AI and embedded engineering.',
};
