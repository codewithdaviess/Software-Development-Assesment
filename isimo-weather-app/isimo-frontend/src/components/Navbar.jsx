import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { name: t.home, path: "/" },
    { name: t.trackedCities, path: "/tracked-cities" },
    { name: t.favorites, path: "/favorites" },
    { name: t.weatherGuide, path: "/weather-guide" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-white/95 backdrop-blur fixed top-0 left-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5896FD] to-[#AECDFF]">
            isimo
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={t.language}
              className="rounded-lg border px-2 py-1 text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="en">English</option>
              <option value="sn">Shona</option>
              <option value="nd">Ndebele</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
            </select>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4 border-b border-slate-100">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-2 p-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
