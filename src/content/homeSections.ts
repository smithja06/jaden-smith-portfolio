/**
 * Homepage sections, in order — the same six as the nav (01 About … 06 Contact).
 * Their ids are also the in-page anchors (/#skills etc.).
 */
export const homeSections = [
  { id: 'about', index: '01', title: 'About' },
  { id: 'experience', index: '02', title: 'Experience' },
  { id: 'projects', index: '03', title: 'Featured projects' },
  { id: 'skills', index: '04', title: 'Skills' },
  { id: 'education', index: '05', title: 'Education' },
  { id: 'contact', index: '06', title: 'Contact' },
] as const;
