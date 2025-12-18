import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/login/login';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Upload from './pages/Upload';
import Templates from './pages/Templates';
import Archive from './pages/Archive';
import { TemplatePreview } from './components/common/TemplatePreview';

const sampleData = {
  noticeNumber: 'N1-20251657-06',
  title: '2026년도 환경달력 제작',
  orgName: '한국환경공단',
  contractPeriod: '계약후 80일',
  amount: '89,670,000원(부가가치세 포함)',
  bidSubmitStart: '2025. 09. .(09:00)',
  bidSubmitEnd: '2025. 09. .(10:00)',
  bidOpenTime: '2025. 09. .(11:00)',
  productCode: '4411200201',
  productName: '달력',
  contactPhone: '032-590-3020',
  contactName: '박찬형 대리',
  contractPhone: '032-590-3274',
  contractName: '이미선 과장',
  consortiumDeadline: '2025. 09. .(18:00)',
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<Index />} />
          <Route path="/create/upload/:type" element={<Upload />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/test" element={<TemplatePreview data={sampleData} />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
