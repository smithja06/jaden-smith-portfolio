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
  socials: SocialLink[];
  affiliationLine: string;
  hero: {
    eyebrow: string;
    headlineLead: string;
    headlineEmphasis: string;
    description: string;
  };
}

export const site: SiteConfig = {
  name: 'Jaden Smith',
  initials: 'JS',
  descriptor: 'Software, AI & embedded systems',
  baseUrl: TODO_USER_CONTENT,
  email: TODO_USER_CONTENT,
  resumeUrl: TODO_USER_CONTENT,
  // Add real profiles only, e.g. { label: 'GitHub', href: 'https://github.com/<you>' }
  socials: [],
  affiliationLine: 'McMaster iBioMed · AI / Software · Embedded & Human-Centered Systems',
  hero: {
    eyebrow: 'Software engineering / AI / Embedded systems',
    headlineLead: 'Building intelligent systems that',
    headlineEmphasis: 'feel alive.',
    description:
      'I’m a software engineer and biomedical engineering student working at the intersection of AI, software, and hardware — turning complex ideas into useful, human-centered experiences.',
  },
};
