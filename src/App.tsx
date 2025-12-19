import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './components/login/login';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Upload from './pages/Upload';
import Templates from './pages/Templates';
import Archive from './pages/Archive';
import NoticeEditor from './pages/NoticeEditor';
import NoticeLoading from './pages/NoticeLoading';
import { TemplatePreview } from './components/common/TemplatePreview';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>



          <Route path="/login" element={<Login />} />

          <Route element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Index />} />
            <Route path="/loading" element={<NoticeLoading />} />
            <Route path="/create/upload/:type" element={<Upload />} />
            <Route path="/editor/:type/:subType" element={<NoticeEditor />} />
            <Route path="/editor/:type/:subType/:documentId" element={<NoticeEditor />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/archive" element={<Archive />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
