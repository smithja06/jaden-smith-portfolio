import { TODO_USER_CONTENT, type Maybe } from './types';

export interface Education {
  school: string;
  program: string;
  /** Only real dates. Hidden while TODO. */
  period: Maybe<string>;
  summary: string;
  /** Real course names only, e.g. 'Signals and Systems'. Empty = section shows a pending note. */
  coursework: string[];
  /** Real awards, scholarships, dean's list, etc. Empty = section shows a pending note. */
  achievements: string[];
}

export const education: Education = {
  school: 'McMaster University',
  program: 'Electrical & Biomedical Engineering (iBioMed)',
  period: TODO_USER_CONTENT,
  summary:
    'Engineering studies that combine electrical systems, software, and biomedical design — the base for most of the work on this site.',
  // TODO_USER_CONTENT: add actual McMaster courses.
  coursework: [],
  // TODO_USER_CONTENT: add actual achievements.
  achievements: [],
};
