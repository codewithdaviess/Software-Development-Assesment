import React, { useState } from "react";
import { Search } from "lucide-react";
import { searchCity } from "../services/api";
import CityCard from "./CityCard";

function Hero() {
  const [cityInput, setCityInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");

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
      setError("City not found. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Header with Search Form */}
      <div className="w-full bg-white pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#5896FD] to-[#AECDFF]">
              Discover Your City's Weather!
            </h1>
            <p className="mb-6 text-gray-500 sm:text-lg">
              Search for your city to get current weather and forecasts.
            </p>

            {!searchResults && (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="p-3 rounded-xl w-full sm:w-80 border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md"
                />

                <button
                  onClick={handleCitySearch}
                  className="flex items-center justify-center px-6 py-3 bg-[#5896FD] text-white rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="w-full bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {searchResults.length === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <CityCard city={searchResults[0]} showSearchHeading={true} />
                <button
                  onClick={() => setSearchResults(null)}
                  className="mt-6 px-4 py-2 bg-[#5896FD] text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md"
                >
                  ← Search another city
                </button>
              </div>
            )}

            {searchResults.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Results for:{" "}
                  <span className="text-[#5896FD]">{cityInput}</span>
                </h2>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                  {searchResults.map((city, index) => (
                    <CityCard key={index} city={city} isSearchResult={true} />
                  ))}
                </div>

                <button
                  onClick={() => setSearchResults(null)}
                  className="px-4 py-2 bg-[#5896FD] text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md"
                >
                  ← Search another city
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
