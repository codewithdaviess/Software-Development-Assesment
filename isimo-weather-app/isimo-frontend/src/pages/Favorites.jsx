import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import CityCard from "../components/CityCard";
import { getFavoriteLocations, updateLocation, deleteLocation } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import { useLanguage } from "../context/LanguageContext";

function Favorites() {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
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
      setError(t.failedFavorites);
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
        addNotification(t.removedFavorites, "success", 3000);
      } else {
        addNotification(t.addedFavorites, "success", 3000);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      addNotification(t.errorUpdatingFavorite, "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      setFavorites((prev) => prev.filter((c) => c.id !== id));
      addNotification(t.removedTracking, "success", 3000);
    } catch (err) {
      console.error("Error deleting location:", err);
      addNotification(t.errorDeletingLocation, "error", 3000);
    }
  };

  if (loading) return <p className="p-6">{t.loadingFavorites}</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center bg-gradient-to-r from-blue-500 to-sky-400 rounded-2xl shadow-xl p-8 sm:p-12 justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.favoriteCities}</h1>
          <button
            onClick={fetchFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t.refresh}
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {favorites.length === 0 ? (
            <p className="text-slate-500">{t.noFavorites}</p>
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
