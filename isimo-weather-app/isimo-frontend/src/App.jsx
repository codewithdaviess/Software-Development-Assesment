import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TrackedCities from "./pages/TrackedCities";
import Favorites from "./pages/Favorites";
import WeatherGuidePage from "./pages/WeatherGuidePage";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationContainer from "./components/NotificationContainer";
import { LanguageProvider } from "./context/LanguageContext";
import logo from "./assets/img/logo.png";

const MotionDiv = motion.div;

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <NotificationProvider>
        <Router>
          <AnimatePresence mode="wait">
            {showSplash ? (
              <MotionDiv
                key="splash"
                className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <MotionDiv
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 1.02 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={logo}
                    alt="isimo logo"
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                  <p className="text-slate-500 text-sm sm:text-base">
                    by <span className="font-bold">davies</span>
                  </p>
                </MotionDiv>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="app"
                className="min-h-screen bg-slate-50 flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Navbar />
                <NotificationContainer />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tracked-cities" element={<TrackedCities />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/weather-guide" element={<WeatherGuidePage />} />
                  </Routes>
                </main>
                <Footer />
              </MotionDiv>
            )}
          </AnimatePresence>
        </Router>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
