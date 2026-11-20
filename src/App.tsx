import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));
const LabWorld = lazy(() => import('./lab3d/LabWorld'));
const VisionMatrixPage = lazy(() => import('./pages/VisionMatrixPage'));
const SignalPlaygroundPage = lazy(() => import('./pages/SignalPlaygroundPage'));
const NeuralNetworkPage = lazy(() => import('./pages/NeuralNetworkPage'));
const About = lazy(() => import('./pages/About'));
const LabSection = lazy(() => import('./pages/lab/LabSectionPage'));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work', element: <Navigate to="/lab/projects" replace /> },
      { path: '/projects', element: <Navigate to="/lab/projects" replace /> },
      { path: '/experience', element: <Navigate to="/lab/experience" replace /> },
      { path: '/experience/:id', element: <ExperienceDetail /> },
      { path: '/work/:slug', element: <CaseStudy /> },
      { path: '/lab', element: <LabWorld /> },
      { path: '/lab/experience', element: <LabSection id="experience" /> },
      { path: '/lab/projects', element: <LabSection id="projects" /> },
      { path: '/lab/skills', element: <LabSection id="skills" /> },
      { path: '/lab/education', element: <LabSection id="education" /> },
      { path: '/lab/contact', element: <LabSection id="contact" /> },
      { path: '/lab/vision-matrix', element: <VisionMatrixPage /> },
      { path: '/lab/signal-playground', element: <SignalPlaygroundPage /> },
      { path: '/lab/neural-network', element: <NeuralNetworkPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Navigate to="/#contact" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
