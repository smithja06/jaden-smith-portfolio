import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Work = lazy(() => import('./pages/Work'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const Lab = lazy(() => import('./pages/Lab'));
const VisionMatrixPage = lazy(() => import('./pages/VisionMatrixPage'));
const SignalPlaygroundPage = lazy(() => import('./pages/SignalPlaygroundPage'));
const About = lazy(() => import('./pages/About'));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work', element: <Work /> },
      { path: '/work/:slug', element: <CaseStudy /> },
      { path: '/lab', element: <Lab /> },
      { path: '/lab/vision-matrix', element: <VisionMatrixPage /> },
      { path: '/lab/signal-playground', element: <SignalPlaygroundPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Navigate to="/#contact" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
