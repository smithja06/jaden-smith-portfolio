import { TODO_USER_CONTENT, type Maybe } from './types';

export interface SocialLink {
  label: string;
  href: string;
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
  socials: SocialLink[];
  affiliationLine: string;
  /** Short role line shown next to the name in the header. */
  role: string;
  /** Portrait in /public (WebP with a JPEG fallback alongside). */
  headshot: { webp: string; jpg: string; alt: string };
  hero: {
    eyebrow: string;
    description: string;
  };
  /** Homepage About card. Keep every claim factual. */
  about: string[];
}

export const site: SiteConfig = {
  name: 'Jaden Smith',
  initials: 'JS',
  descriptor: 'Software, AI & embedded systems',
  baseUrl: TODO_USER_CONTENT,
  email: TODO_USER_CONTENT,
  resumeUrl: '/Jaden-Smith-Resume.pdf',
  resumeFilename: 'Jaden Smith - Resume.pdf',
  // Add real profiles only, e.g. { label: 'GitHub', href: 'https://github.com/<you>' }
  socials: [],
  affiliationLine: 'McMaster iBioMed · AI / Software · Embedded & Human-Centered Systems',
  role: 'Software · AI · Embedded',
  headshot: { webp: '/jaden-headshot.webp', jpg: '/jaden-headshot.jpg', alt: 'Portrait of Jaden Smith' },
  hero: {
    eyebrow: 'Electrical & Biomedical Engineering — McMaster University',
    description:
      'Software engineer building AI developer tooling, embedded sensing prototypes, and human-centered interfaces.',
  },
  about: [
    'I’m an Electrical & Biomedical Engineering student at McMaster University (iBioMed), and I’ve worked as an AI / Software Developer co-op at RBC on developer tooling and AI-assisted engineering workflows.',
    'On student teams I’ve led the system-control side of MED-T’s sensory-substitution prototype and contributed software to BMETT’s ACL-rehabilitation project. I like work that crosses from code into hardware and real people.',
  ],
};
