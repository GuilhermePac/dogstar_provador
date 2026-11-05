import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StudioProvider } from './hooks/useStudio';
import { ToastProvider } from './hooks/useToast';
import Home from './pages/Home';

// Every page except the home is code-split and loaded on demand.
const Start = lazy(() => import('./pages/Start'));
const Breeds = lazy(() => import('./pages/Breeds'));
const BreedDetail = lazy(() => import('./pages/BreedDetail'));
const Upload = lazy(() => import('./pages/Upload'));
const TryOn = lazy(() => import('./pages/TryOn'));
const Grooming = lazy(() => import('./pages/Grooming'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Result = lazy(() => import('./pages/Result'));
const SavedLooks = lazy(() => import('./pages/SavedLooks'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <ToastProvider>
        <StudioProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="comecar" element={<Start />} />
              <Route path="racas" element={<Breeds />} />
              <Route path="racas/:slug" element={<BreedDetail />} />
              <Route path="enviar-foto" element={<Upload />} />
              <Route path="provador" element={<TryOn />} />
              <Route path="provador/resultado" element={<Result />} />
              <Route path="tosas" element={<Grooming />} />
              <Route path="roupas" element={<Catalog kind="clothes" />} />
              <Route path="acessorios" element={<Catalog kind="accessory" />} />
              <Route path="meus-looks" element={<SavedLooks />} />
              <Route path="sobre" element={<About />} />
              <Route path="privacidade" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </StudioProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
