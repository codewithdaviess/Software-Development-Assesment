import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import CityCard from "../components/CityCard";
import { getFavoriteLocations, updateLocation, deleteLocation } from "../services/api";
import { useNotification } from "../context/NotificationContext";

function Favorites() {
  const { addNotification } = useNotification();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavoriteLocations();
      const favs = Array.isArray(res.data) ? res.data : res.data.data || [];
      setFavorites(favs);
      setError("");
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (id) => {
    try {
      const city = favorites.find((c) => c.id === id);
      if (!city) return;

      const newFavoriteStatus = !city.is_favorite;

      await updateLocation(id, { ...city, is_favorite: newFavoriteStatus });

      setFavorites((prev) => prev.filter((c) => (c.id === id ? !newFavoriteStatus : true)));

      if (!newFavoriteStatus) {
        addNotification("Removed from favorites", "success", 3000);
      } else {
        addNotification("Added to favorites", "success", 3000);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      addNotification("Error updating favorite", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      setFavorites((prev) => prev.filter((c) => c.id !== id));
      addNotification("Removed from tracking", "success", 3000);
    } catch (err) {
      console.error("Error deleting location:", err);
      addNotification("Error deleting location", "error", 3000);
    }
  };

  if (loading) return <p className="p-6">Loading favorites...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center bg-white rounded-2xl shadow-2xl p-8 sm:p-12 justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Favorite Cities</h1>
          <button
            onClick={fetchFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#5896FD] rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {favorites.length === 0 ? (
            <p className="text-gray-500">No favorites yet. Mark a tracked city as favorite to see it here.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onFavorite={handleFavorite}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;