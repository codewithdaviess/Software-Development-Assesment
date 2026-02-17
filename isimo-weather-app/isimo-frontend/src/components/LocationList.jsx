import React, { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import CityCard from "./CityCard";
import { getLocations, deleteLocation, updateLocation } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function LocationList() {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await getLocations();

        if (Array.isArray(res.data)) {
          setCities(res.data);
        } else if (Array.isArray(res.data.data)) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(t.failedLocations);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [t.failedLocations]);

  const handleFavorite = async (id) => {
    try {
      const city = cities.find((c) => c.id === id);
      if (!city) return;

      const newFavoriteStatus = !city.is_favorite;

      await updateLocation(id, {
        ...city,
        is_favorite: newFavoriteStatus,
      });

      setCities((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_favorite: newFavoriteStatus } : c,
        ),
      );

      if (newFavoriteStatus) {
        addNotification(t.addedFavorites, "success", 3000);
      } else {
        addNotification(t.removedFavorites, "success", 3000);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      addNotification(t.errorUpdatingFavorite, "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const city = cities.find((c) => c.id === id);
      if (!city) return;

      await deleteLocation(id);
      setCities((prev) => prev.filter((c) => c.id !== id));
      addNotification(t.removedTracking, "success", 3000);
    } catch (err) {
      console.error("Error deleting location:", err);
      addNotification(t.errorDeletingLocation, "error", 3000);
    }
  };

  if (loading) return <p className="p-6">{t.loadingCities}</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="w-full bg-white">
      <div className="w-full bg-white max-w-6xl mx-auto p-4 sm:p-6">
        {cities.length > 0 && (
          <h2 className="text-2xl text-center font-semibold text-slate-500 mb-6">
            {t.manageLocations}
          </h2>
        )}

        {cities.length === 0 && (
          <p className="text-slate-500">{t.noCitiesYet}</p>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onFavorite={handleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
