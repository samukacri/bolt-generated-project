import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
//import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // REMOVE THIS
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import Bible from "./pages/Bible";
import Settings from "./pages/Settings";
import Prayers from "./pages/Prayers";
import PrayerDetails from "./pages/PrayerDetails";
import Auth from "./pages/Auth";

const App = () => {
  // const [queryClient] = useState(() => new QueryClient({  // REMOVE THIS
  //   defaultOptions: {
  //     queries: {
  //       staleTime: 60 * 1000,
  //     },
  //   },
  // }));

  return (
    // <QueryClientProvider client={queryClient}>  REMOVE THIS
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/bible" element={<Bible />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/prayers" element={<Prayers />} />
                <Route path="/prayers/:id" element={<PrayerDetails />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    // </QueryClientProvider> REMOVE THIS
  );
};

export default App;
