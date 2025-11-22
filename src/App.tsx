import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Kyc from "./pages/Kyc";
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
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/kyc" 
              element={
                  <Kyc />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buy-credits" 
              element={
                <ProtectedRoute>
                  <BuyCredits />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sell-credits" 
              element={
                <ProtectedRoute>
                  <SellCredits />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calculator" 
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/education" 
              element={
                <ProtectedRoute>
                  <Education />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forum" 
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;