/**
 * Technology inventory, grouped by capability.
 *
 * Skill names are canonical: projects and experience entries list the same
 * strings in their `tech` arrays, and the Skills explorer derives
 * "where it was used" from those arrays. There is no separate mapping to
 * maintain. A content test fails if a project uses a name that isn't here.
 *
 * Tools the inventory marks as "to verify" or "considered only" (SPI,
 * Tailwind CSS, SwiftUI/SwiftData/Swift Charts, Supabase, Expo SQLite) are
 * deliberately left out until their use is confirmed.
 */
export interface Skill {
  name: string;
  /** Short qualifier shown next to the name, e.g. 'DELF B2 · 83%'. */
  note?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  summary: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Programming languages',
    summary: 'The languages behind the projects, from firmware to web apps.',
    skills: [
      { name: 'Python' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Java' },
      { name: 'C / C++' },
      { name: 'Swift' },
      { name: 'SQL' },
      { name: 'Bash' },
      { name: 'MATLAB' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend, mobile & product development',
    summary: 'Interfaces for web, 3D and iOS, and the design work behind them.',
    skills: [
      { name: 'React' },
      { name: 'React Native' },
      { name: 'Expo' },
      { name: 'Vite' },
      { name: 'HTML / CSS' },
      { name: 'Three.js' },
      { name: 'React Three Fiber' },
      { name: 'Responsive design & animation' },
      { name: 'iOS development' },
      { name: 'Augmented reality' },
      { name: 'Shopify' },
      { name: 'UI / UX design' },
      { name: 'Accessible web design' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend, cloud & infrastructure',
    summary: 'APIs, services, databases and the plumbing between systems.',
    skills: [
      { name: 'FastAPI' },
      { name: 'Spring Boot' },
      { name: 'Node.js' },
      { name: 'REST APIs' },
      { name: 'Firebase Authentication' },
      { name: 'IBM MQ', note: 'integration in progress' },
      { name: 'Microsoft Entra ID', note: 'integration in progress' },
      { name: 'MongoDB Atlas' },
      { name: 'Atlas Vector Search' },
      { name: 'Docker' },
      { name: 'Git & GitHub' },
      { name: 'Google Analytics 4' },
      { name: 'System architecture' },
    ],
  },
  {
    id: 'ai',
    label: 'AI, machine learning & computer vision',
    summary: 'Agents and retrieval, vision pipelines, and turning sensor data into decisions.',
    skills: [
      { name: 'AI agents' },
      { name: 'Devin Cloud' },
      { name: 'Agent Skills' },
      { name: 'RAG' },
      { name: 'Voice agents (ElevenLabs)' },
      { name: 'Spec Kit' },
      { name: 'AI maturity assessment' },
      { name: 'Machine learning' },
      { name: 'OpenCV' },
      { name: 'K-means clustering' },
      { name: 'MediaPipe' },
      { name: 'TensorFlow Lite' },
      { name: 'Depth estimation (MiDaS)', note: 'benchmarked' },
      { name: 'Edge density & dense inverse search' },
      { name: 'NumPy' },
      { name: 'scikit-learn' },
      { name: 'Sensor feature extraction' },
      { name: 'Data visualization & dashboards' },
      { name: 'Statistical analysis' },
    ],
  },
  {
    id: 'embedded',
    label: 'Embedded systems & electronics',
    summary: 'Microcontrollers, sensors and protocols, and the circuits underneath.',
    skills: [
      { name: 'ESP32' },
      { name: 'Raspberry Pi' },
      { name: 'Arduino' },
      { name: 'PCA9685' },
      { name: 'PWM & multiplexing' },
      { name: 'IMU (BNO055)' },
      { name: 'IMU & magnetometer' },
      { name: 'EMG' },
      { name: 'Haptic & actuator control' },
      { name: 'Camera integration' },
      { name: 'UART' },
      { name: 'I²C' },
      { name: 'BLE' },
      { name: 'Circuit analysis' },
      { name: 'Op-amp circuits' },
      { name: 'Rectifiers & power supplies' },
      { name: 'CMOS transmission gates' },
      { name: 'LTspice' },
      { name: 'Analog Discovery 3' },
    ],
  },
  {
    id: 'tools-leadership',
    label: 'Engineering tools, design & leadership',
    summary: 'Designing for people, building prototypes and leading the teams that build.',
    skills: [
      { name: 'CAD' },
      { name: 'Prototyping & integration' },
      { name: 'Human-centered design' },
      { name: 'Project management' },
      { name: 'Team leadership & recruiting' },
      { name: 'Technical teaching' },
      { name: 'Technical presentation' },
    ],
  },
];

/** The three directions the work falls into; each line summarizes documented projects and roles. */
export const focusAreas: { id: string; title: string; text: string }[] = [
  { id: 'software', title: 'Software Engineering', text: 'Full-stack development: frontend applications and backend systems.' },
  { id: 'ai', title: 'AI & Machine Learning', text: 'AI agents, engineering automation, machine learning and computer vision.' },
  { id: 'embedded', title: 'Embedded & Biomedical Systems', text: 'Firmware, sensor integration, device communication and physical interfaces.' },
];

/** Spoken languages and language certification, kept apart from programming languages. */
export const spokenLanguages: Skill[] = [
  { name: 'English', note: 'fluent' },
  { name: 'French', note: 'DELF B2 · 83%' },
];

/**
 * The short list shown first on the Skills page: technologies with the
 * strongest linked evidence, spanning software, AI and embedded work.
 * Every other skill stays in the full catalogue.
 */
export const coreSkills = [
  'Python',
  'TypeScript',
  'React',
  'Java',
  'FastAPI',
  'AI agents',
  'OpenCV',
  'ESP32',
];

export const allSkills: Skill[] = [...skillGroups.flatMap((g) => g.skills), ...spokenLanguages];

/** URL-safe id for a skill name, used in /lab/skills?skill=<id>. */
export function skillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/²/g, '2')
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
