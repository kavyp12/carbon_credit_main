import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import BuyCredits from "./pages/BuyCredits";
import SellCredits from "./pages/SellCredits";
import Calculator from "./pages/Calculator";
import Education from "./pages/Education";
import Forum from "./pages/Forum";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Kyc from "./pages/Kyc"; // Fixed casing to match actual filename
import Profile from "./pages/profile";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Web3Provider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kyc" element={<Kyc />} />
            <Route path="profile" element={<Profile />} />
            <Route path="Analytics" element={<Analytics />} />
            <Route path="/buy-credits" element={<BuyCredits />} />
            <Route path="/sell-credits" element={<SellCredits />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/education" element={<Education />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;