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
    label: 'Frontend & mobile',
    summary: 'Interfaces for web, 3D and iOS.',
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
    ],
  },
  {
    id: 'backend',
    label: 'Backend, data & infrastructure',
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
    label: 'AI, ML & agentic systems',
    summary: 'Agents, retrieval and ways of measuring how AI is used.',
    skills: [
      { name: 'AI agents' },
      { name: 'Devin Cloud' },
      { name: 'Agent Skills' },
      { name: 'RAG' },
      { name: 'Voice agents (ElevenLabs)' },
      { name: 'Spec Kit' },
      { name: 'AI maturity assessment' },
      { name: 'Machine learning' },
    ],
  },
  {
    id: 'vision-data',
    label: 'Computer vision & data analysis',
    summary: 'Turning images and sensor streams into decisions.',
    skills: [
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
    label: 'Embedded systems & protocols',
    summary: 'Microcontrollers, sensors, the hardware they drive and how the parts talk.',
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
    ],
  },
  {
    id: 'electronics',
    label: 'Electronics & engineering tools',
    summary: 'Circuits, measurement and analysis.',
    skills: [
      { name: 'Circuit analysis' },
      { name: 'Op-amp circuits' },
      { name: 'Rectifiers & power supplies' },
      { name: 'CMOS transmission gates' },
      { name: 'LTspice' },
      { name: 'Analog Discovery 3' },
      { name: 'CAD' },
      { name: 'Structural analysis' },
      { name: 'Excel' },
    ],
  },
  {
    id: 'product',
    label: 'Product design & leadership',
    summary: 'Designing for people and leading the teams that build.',
    skills: [
      { name: 'Human-centered design' },
      { name: 'Prototyping & integration' },
      { name: 'UI / UX design' },
      { name: 'Accessible web design' },
      { name: 'Project management' },
      { name: 'Team leadership & recruiting' },
      { name: 'Technical teaching' },
      { name: 'Technical presentation' },
    ],
  },
  {
    id: 'spoken',
    label: 'Spoken languages & certifications',
    summary: 'Languages I work in.',
    skills: [
      { name: 'English', note: 'fluent' },
      { name: 'French', note: 'DELF B2 · 83%' },
    ],
  },
];

/**
 * The short list shown first on the Skills page — the technologies behind the
 * strongest projects. Every other skill stays one click away in its group.
 */
export const coreSkills = [
  'Python',
  'TypeScript',
  'React',
  'Java',
  'Spring Boot',
  'FastAPI',
  'MongoDB Atlas',
  'AI agents',
  'RAG',
  'ESP32',
  'OpenCV',
  'C / C++',
];

export const allSkills: Skill[] = skillGroups.flatMap((g) => g.skills);

/** URL-safe id for a skill name, used in /lab/skills?skill=<id>. */
export function skillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/²/g, '2')
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
