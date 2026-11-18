/**
 * Skills grouped by capability. Only list tools actually used in the work on
 * this site; extend with real ones.
 */
export interface SkillCategory {
  id: 'software' | 'ai' | 'embedded' | 'signals' | 'product';
  label: string;
  summary: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'software',
    label: 'Software',
    summary: 'Production-minded application code and the tooling around it.',
    items: ['TypeScript', 'React', 'Developer tooling'],
  },
  {
    id: 'ai',
    label: 'AI & ML',
    summary: 'Practical AI in engineering workflows, and ML on sensor data.',
    items: ['AI-assisted workflows', 'Machine learning on sensor data'],
  },
  {
    id: 'embedded',
    label: 'Embedded',
    summary: 'Microcontrollers and the hardware they drive.',
    items: ['ESP32', 'Serial communication', 'LED / actuator control'],
  },
  {
    id: 'signals',
    label: 'Sensing & signals',
    summary: 'Turning noisy real-world measurements into something usable.',
    items: ['Image processing', 'IMU', 'EMG', 'Signal filtering'],
  },
  {
    id: 'product',
    label: 'Interfaces',
    summary: 'Interfaces that explain themselves and feel good to use.',
    items: ['Interaction design', 'Front-end engineering'],
  },
];
