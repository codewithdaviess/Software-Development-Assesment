import React, { useState } from "react";
import { Search } from "lucide-react";
import { searchCity } from "../services/api";
import CityCard from "./CityCard";
import { useLanguage } from "../context/LanguageContext";

const trendingCities = ["Tokyo", "Paris", "Cape Town", "Dubai", "Rio", "New York"];

function Hero() {
  const [cityInput, setCityInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleCitySearch = async (cityName = cityInput) => {
    if (!cityName.trim()) return;

    setError("");
    setSearchResults(null);

    try {
      const searchRes = await searchCity(cityName);
      const cities = searchRes.data.data;

      if (!cities || cities.length === 0) {
        throw new Error("City not found");
      }

      setSearchResults(cities);
    } catch (err) {
      console.error(err);
      setError(t.cityNotFound);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gradient-to-b from-blue-50 to-slate-50 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-100">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
              {t.heroTitle}
            </h1>
            <p className="mb-6 text-slate-500 sm:text-lg">{t.heroSubtitle}</p>

            {!searchResults && (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder={t.cityPlaceholder}
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="p-3 rounded-xl w-full sm:w-80 border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                />

                <button
                  onClick={() => handleCitySearch()}
                  className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-600 transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {t.search}
                </button>
              </div>
            )}

            {!searchResults && (
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-500 mb-3">{t.trendingPlaces} · {t.trendingSubtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {trendingCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setCityInput(city);
                        handleCitySearch(city);
                      }}
                      className="px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>

      {searchResults && (
        <div className="w-full bg-slate-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {searchResults.length === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <CityCard city={searchResults[0]} showSearchHeading />
                <button
                  onClick={() => setSearchResults(null)}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-sm"
                >
                  ← {t.searchAnotherCity}
                </button>
              </div>
            )}

            {searchResults.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {t.resultsFor}: <span className="text-blue-500">{cityInput}</span>
                </h2>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                  {searchResults.map((city, index) => (
                    <CityCard key={index} city={city} isSearchResult />
                  ))}
                </div>

                <button
                  onClick={() => setSearchResults(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-sm"
                >
                  ← {t.searchAnotherCity}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
