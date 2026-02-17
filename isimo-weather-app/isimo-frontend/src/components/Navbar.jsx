import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    try {
      const stored = localStorage.getItem("theme");
      if (stored) {
        setTheme(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
      } else {
        // fallback to prefers-color-scheme
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    } catch (e) {
      console.error("Failed to initialize theme", e);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const links = [
    { name: t.home, path: "/" },
    { name: t.trackedCities, path: "/tracked-cities" },
    { name: t.favorites, path: "/favorites" },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur fixed top-0 left-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-3 sm:px-8 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5896FD] to-[#AECDFF]">
          isimo
        </div>

        {/* Menu toggle button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleTheme()}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-slate-100 shadow-sm"
          >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-slate-700" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t.language}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-700 bg-white shadow-sm"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full hover:bg-slate-100 shadow-sm"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Slide-out menu */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          w-3/4 sm:w-3/4 lg:w-1/4
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Menu items */}
        <ul className="flex flex-col space-y-4 p-6 text-slate-700">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium hover:text-blue-600 ${
                    isActive ? "text-blue-600 underline" : "text-slate-700"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {/* Theme toggle inside menu for discoverability */}
          <li>
            <button
              onClick={() => toggleTheme()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>{theme === "dark" ? t.lightMode : t.darkMode}</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay on all screen sizes when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
}
