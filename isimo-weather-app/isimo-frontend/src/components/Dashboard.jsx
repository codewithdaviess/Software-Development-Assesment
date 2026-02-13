import React, { useState, useEffect } from "react";
import { getLocations, getFavoriteLocations } from "../services/api";
import { MapPin, Heart, RotateCcw, Calendar, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [totalLocations, setTotalLocations] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [locRes, favRes] = await Promise.all([
        getLocations(),
        getFavoriteLocations(),
      ]);

      const locations = Array.isArray(locRes.data)
        ? locRes.data
        : locRes.data.data || [];
      const favorites = Array.isArray(favRes.data)
        ? favRes.data
        : favRes.data.data || [];

      setTotalLocations(locations.length);
      setFavoriteCount(favorites.length);
      setLastSync(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return "Never";
    const now = new Date();
    const diff = Math.floor((now - lastSync) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastSync.toLocaleDateString();
  };

  return (
    <div className="w-full mt-8 sm:mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Weather Dashboard
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Locations Card */}
        <button
          onClick={() => setSelectedCard("locations")}
          className="bg-gradient-to-br from-[#5896FD] to-[#4080E8] border border-[#5896FD] rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {totalLocations}
          </span>
          <p className="text-xs sm:text-sm text-white font-medium mb-2 opacity-90">
            Tracked Cities
          </p>
        </button>

        {/* Favorite Locations Card */}
        <button
          onClick={() => setSelectedCard("favorites")}
          className="bg-gradient-to-br from-[#5896FD] to-[#4080E8] border border-[#5896FD] rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {favoriteCount}
          </span>
          <p className="text-xs sm:text-sm text-white font-medium mb-2 opacity-90">
            Favorites
          </p>
        </button>

        {/* Last Sync Card - Click to Refresh */}
        <button
          onClick={fetchStats}
          disabled={loading}
          className="bg-gradient-to-br from-[#5896FD] to-[#4080E8] border border-[#5896FD] rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left group disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-2">
            <RotateCcw
              className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`}
            />
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs sm:text-sm text-white font-medium mb-1 opacity-90">
            Last Sync
          </p>
          <p className="text-sm sm:text-base font-bold text-white">
            {formatLastSync()}
          </p>
        </button>
      </div>

      {/* Refresh Button - Standalone */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#5896FD] text-white rounded-lg font-semibold hover:bg-[#4080E8] disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          <RotateCcw
            className={`w-5 h-5 transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`}
          />
          <span>{loading ? "Syncing..." : "Refresh All Data"}</span>
        </button>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600">
          ℹ️ Dashboard updates automatically every 30 seconds. Click any card to
          interact or refresh manually.
        </p>
      </div>

      {/* Selected Card Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full">
            <button
              onClick={() => setSelectedCard(null)}
              className="float-right text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            {selectedCard === "locations" && (
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  📍 Tracked Cities
                </h3>
                <p className="text-gray-700 mb-4">
                  You are currently tracking{" "}
                  <span className="font-bold text-lg">{totalLocations}</span>{" "}
                  cities.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  View and manage all your tracked locations in the Manage
                  Locations section below.
                </p>
                <button
                  onClick={() => {
                    setSelectedCard(null);
                    document
                      .getElementById("locations-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Go to Locations
                </button>
              </div>
            )}
            {selectedCard === "favorites" && (
              <div>
                <h3 className="text-2xl font-bold text-yellow-600 mb-4">
                  ❤️ Favorite Cities
                </h3>
                <p className="text-gray-700 mb-4">
                  You have{" "}
                  <span className="font-bold text-lg">{favoriteCount}</span>{" "}
                  favorite cities.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Click any location card and press the Favorite button to add
                  or remove from favorites.
                </p>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
