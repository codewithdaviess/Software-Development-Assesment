import React, { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import {
  getWeather,
  getForecast,
  createLocation,
  updateLocation,
} from "../services/api";
import { Heart, Trash2, Save, Edit2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const weatherIcons = {
  clear: "\u2600\ufe0f",
  sunny: "\u2600\ufe0f",
  clouds: "\u2601\ufe0f",
  cloudy: "\u2601\ufe0f",
  rain: "\ud83c\udf27\ufe0f",
  rainy: "\ud83c\udf27\ufe0f",
  drizzle: "\ud83c\udf27\ufe0f",
  thunderstorm: "\u26c8\ufe0f",
  storm: "\u26c8\ufe0f",
  snow: "\u2744\ufe0f",
  snowy: "\u2744\ufe0f",
  mist: "\ud83c\udf2b\ufe0f",
  fog: "\ud83c\udf2b\ufe0f",
  haze: "\ud83c\udf2b\ufe0f",
};

function normalizeWeatherType(type) {
  if (!type) return "clear";

  const t = type.toLowerCase();

  if (t.includes("cloud")) return "clouds";
  if (t.includes("rain")) return "rain";
  if (t.includes("drizzle")) return "drizzle";
  if (t.includes("storm") || t.includes("thunder")) return "thunderstorm";
  if (t.includes("snow")) return "snow";
  if (t.includes("fog") || t.includes("mist") || t.includes("haze")) return "mist";
  if (t.includes("clear")) return "clear";

  return "clear";
}

export default function CityCard({
  city,
  onFavorite,
  onDelete,
  showSearchHeading = false,
  isSearchResult = false,
}) {
  const { addNotification } = useNotification();
  const { t } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showSearchHeading);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(city.name);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const weatherRes = await getWeather(city.name);
        const forecastRes = await getForecast(city.name);
        setWeather(weatherRes.data.data);
        setForecast(forecastRes.data.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }

    fetchData();
  }, [city.name]);

  const handleSaveLocation = async () => {
    try {
      setSaving(true);
      await createLocation({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      });

      setSaved(true);
      addNotification(t.addedTracking, "success", 3000);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      if (
        error.response?.status === 409 ||
        error.message?.includes("duplicate") ||
        error.message?.includes("already")
      ) {
        setSaved(true);
        addNotification(t.addedTracking, "success", 3000);
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error("Error saving location:", error);
        addNotification(t.errorSavingLocation, "error", 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) return;

    try {
      setIsSavingEdit(true);
      await updateLocation(city.id, { name: editedName });
      city.name = editedName;
      setIsEditing(false);
      addNotification(t.locationRenamed, "success", 3000);
    } catch (error) {
      console.error("Error updating location:", error);
      addNotification(t.errorUpdatingLocation, "error", 3000);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(city.name);
    setIsEditing(false);
  };

  const selectedDay = forecast[selectedIndex] || {};
  const rawType = selectedDay.type || weather?.weatherType || weather?.weather?.[0]?.main;
  const normalizedType = normalizeWeatherType(rawType);
  const icon = weatherIcons[normalizedType] || "\u2600\ufe0f";

  const temp =
    selectedDay.temp !== undefined
      ? Math.round(selectedDay.temp)
      : weather?.main?.temp !== undefined
      ? Math.round(weather.main.temp)
      : "--";

  return (
    <div className="bg-white w-full">
      {showSearchHeading && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {"\ud83d\udd0d"} {t.searchResultsFor}: <span className="text-[#5896FD]">{city.name}</span>
        </h2>
      )}

      <div
        onClick={() => !showSearchHeading && setIsExpanded(!isExpanded)}
        className={`rounded-xl shadow-lg border border-[#5896FD]/20 p-6 w-full ${
          !showSearchHeading && "cursor-pointer hover:shadow-xl transition-shadow"
        }`}
      >
        <div className="flex items-start space-x-4">
          <span className="text-5xl">{icon}</span>
          <span className="text-4xl font-bold">{temp}{"\u00b0"}</span>

          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {selectedDay.type ?? weather?.weatherType ?? weather?.weather?.[0]?.main ?? "N/A"}
            </span>
            <span className="text-gray-500 text-sm capitalize">
              {selectedDay.description ??
                weather?.description ??
                weather?.weather?.[0]?.description ??
                "N/A"}
            </span>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-4 flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border border-[#5896FD] rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5896FD]"
              placeholder={t.enterLocationName}
            />
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition-all"
              >
                {t.save}
              </button>
              <button
                onClick={handleCancelEdit}
                className="w-full px-3 py-2 bg-gray-400 text-white text-sm rounded-lg font-semibold hover:bg-gray-500 transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        ) : (
          <h3 className="text-lg font-medium text-gray-800 mt-4">
            {city.name}, {city.country}
            {!showSearchHeading && (
              <span className="text-xs text-gray-400 ml-2">{t.clickToManage}</span>
            )}
          </h3>
        )}

        {forecast.length > 0 && (
          <div className="flex bg-white flex-wrap justify-center lg:justify-between gap-2 mt-4">
            {forecast.slice(0, 5).map((day, index) => {
              const isActive = index === selectedIndex;
              const dayIcon = weatherIcons[normalizeWeatherType(day.type)] || "\u2600\ufe0f";

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#5896FD] text-white scale-105 shadow-md"
                      : "bg-gray-200 text-slate-500 hover:text-white hover:bg-gray-400"
                  } rounded-full w-12 sm:w-14 lg:w-12 p-2 sm:p-3 lg:p-2 text-xs`}
                >
                  <span className="font-medium text-xs">{day.day}</span>
                  <span className="text-lg sm:text-xl lg:text-lg">{dayIcon}</span>
                  <span className="font-semibold text-xs">
                    {Math.round(day.temp)}
                    {"\u00b0"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(isExpanded || showSearchHeading || isSearchResult) && !isEditing && (
          <div className="flex gap-1 mt-4 flex-wrap">
            {(showSearchHeading || isSearchResult) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveLocation();
                }}
                disabled={saving || saved}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-[#5896FD] text-white hover:bg-blue-600"
                } disabled:opacity-50`}
              >
                <Save className="w-3 h-3" />
                <span>{saved ? t.saved : saving ? t.saving : t.save}</span>
              </button>
            )}

            {!showSearchHeading && onFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(city.id);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  city.is_favorite
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>{city.is_favorite ? t.fav : t.favorite}</span>
              </button>
            )}

            {!showSearchHeading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              >
                <Edit2 className="w-3 h-3" />
                <span>{t.edit}</span>
              </button>
            )}

            {!showSearchHeading && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(city.id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.delete}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
