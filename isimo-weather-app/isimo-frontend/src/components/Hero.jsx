import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { searchCity } from "../services/api";
import CityCard from "./CityCard";
import { useLanguage } from "../context/LanguageContext";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const trendingCities = [
  "Tokyo",
  "Paris",
  "Cape Town",
  "Dubai",
  "Rio",
  "New York",
];

function Hero() {
  const { t } = useLanguage();

  const [cityInput, setCityInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef(null);

  /* ---------------- LOAD HISTORY ---------------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(saved);
  }, []);

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- UPDATE HISTORY ---------------- */
  const updateHistory = (cityName) => {
    let updated = [cityName, ...history.filter((c) => c !== cityName)];
    updated = updated.slice(0, 5);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  /* ---------------- SEARCH ---------------- */
  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;

    setError("");
    setSearchCompleted(false);
    setSearchResults(null);
    setIsSearching(true);

    try {
      const res = await searchCity(cityInput);
      const cities = res.data.data;

      if (!cities || cities.length === 0) {
        throw new Error();
      }

      setSearchResults(cities);
      setSearchCompleted(true);
      updateHistory(cityInput);
    } catch {
      setError(t.cityNotFound);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  /* ---------------- AUTOCOMPLETE ---------------- */
  const handleInputChange = (value) => {
    setCityInput(value);
    setShowDropdown(true);
    setSearchCompleted(false);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filteredHistory = history.filter((h) =>
      h.toLowerCase().includes(value.toLowerCase()),
    );

    setSuggestions(filteredHistory);
  };

  /* ---------------- REMOVE HISTORY ITEM ---------------- */
  const removeHistoryItem = (item) => {
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const searchSkeletonCount = 6;

  return (
    <>
      {/* HERO SECTION */}
      <MotionDiv
        className="w-full bg-white pt-20 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className=" flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-6xl w-full">
            <MotionDiv
              className="bg-white rounded-2xl p-8 sm:p-12 border-slate-100 relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              {/* Hero Title */}
              <MotionH1
                className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                {t.heroTitle}
              </MotionH1>

              {/* Hero Subtitle */}
              <MotionP
                className="mb-6 text-slate-500 sm:text-md text-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              >
                {t.heroSubtitle}
              </MotionP>

              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-96" ref={dropdownRef}>
                <div className="flex gap-4 justify-center w-full">
                  <input
                    type="text"
                    placeholder={t.cityPlaceholder}
                    value={cityInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    className="p-3 rounded-xl w-full border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                  />

                  <button
                    onClick={handleCitySearch}
                    disabled={searchCompleted || isSearching}
                    className={`flex items-center justify-center px-6 py-3 rounded-xl  font-semibold shadow-sm transition-all
              ${
                searchCompleted || isSearching
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isSearching ? t.loadingCities : t.search}
                  </button>
                </div>

                {/* HISTORY DROPDOWN (MATCHES INPUT WIDTH) */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setCityInput(item);
                          setShowDropdown(false);
                        }}
                      >
                        <span className="text-sm text-slate-700">{item}</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(item);
                          }}
                          className="p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TRENDING PLACES INSIDE CARD */}
              <div className="mt-6 w-full text-center">
                <p className="text-sm font-medium text-slate-500 mb-3">
                  {t.trendingPlaces}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {trendingCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setCityInput(city)}
                      className="px-3 py-1.5 rounded-full text-sm bg-blue-50 text-slate-500 hover:bg-blue-100 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 mt-4 text-center">{error}</p>
              )}
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>

      {/* RESULTS SECTION BELOW HERO */}
      <AnimatePresence mode="wait">
        {(isSearching || searchResults) && (
          <MotionDiv
            key={isSearching ? "searching" : "results"}
            className="w-full  py-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {isSearching ? (
                <>
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    {t.search}...
                  </h2>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: searchSkeletonCount }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse"
                      >
                        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4" />
                        <div className="h-5 w-1/2 bg-slate-200 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-slate-100 rounded mb-6" />
                        <div className="flex gap-2">
                          <div className="h-10 w-10 rounded-full bg-slate-200" />
                          <div className="h-10 w-10 rounded-full bg-slate-200" />
                          <div className="h-10 w-10 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    {t.showingResults} {searchResults.length}{" "}
                    {searchResults.length === 1 ? t.result : t.resultsForCount}{" "}
                    {t.forWord}{" "}
                    <span className="text-blue-500">{cityInput}</span>
                  </h2>

                  {/* GRID RESULTS */}
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((city, index) => (
                      <CityCard key={index} city={city} isSearchResult />
                    ))}
                  </div>
                </>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}

export default Hero;
