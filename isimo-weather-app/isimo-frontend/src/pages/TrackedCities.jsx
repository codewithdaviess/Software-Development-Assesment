import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { getLocations, searchCity } from "../services/api";
import LocationList from "../components/LocationList";
import CityCard from "../components/CityCard";
import { useLanguage } from "../context/LanguageContext";

function TrackedCities() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");
  const [lastSynced, setLastSynced] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      setLoading(true);
      const res = await getLocations();
      const cities = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setCount(cities.length);

      // Update sync time after successful fetch
      setLastSynced(new Date());
    } catch (err) {
      console.error("Error fetching count:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;

    setError("");
    setSearchResults(null);

    try {
      const searchRes = await searchCity(cityInput);
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
    <div className="w-full bg-white pt-20 pb-8">
      <div className="flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl w-full">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border-slate-100 relative flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
              {t.addManageTracked}
            </h1>
            <p className="mb-6 text-slate-500 sm:text-lg">
              {t.trackedSubtitle}
            </p>

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
                  onClick={handleCitySearch}
                  className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-600 transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {t.search}
                </button>
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
                  ← {t.addAnotherCity}
                </button>
              </div>
            )}

            {searchResults.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {t.resultsFor}:{" "}
                  <span className="text-blue-500">{cityInput}</span>
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
                  ← {t.addAnotherCity}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {count} {t.trackedCount}
              </h2>

              {lastSynced && (
                <p className="text-sm text-slate-500 mt-1">
                  {t.lastSynced || "Last synced"}:{" "}
                  {lastSynced.toLocaleString()}
                </p>
              )}
            </div>

            <button
              onClick={fetchCount}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {t.refresh}
            </button>
          </div>

          <LocationList />
        </div>
      </div>
    </div>
  );
}

export default TrackedCities;
