import React, { useEffect, useState } from "react";

function WeatherForecast({ lat, lon }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 5-day forecast from backend
  useEffect(() => {
    const fetchForecast = async () => {
      if (!lat || !lon) return;

      try {
        const res = await fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        // Assuming your backend returns an array of 5 days:
        // [{ date: '2026-02-13', temp: 22, description: 'Clear Sky' }, ...]
        setForecast(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  // Format date like "13 Feb"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Next 5 Days</h2>

      {loading ? (
        <p>Loading forecast...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <p className="font-semibold mb-2">{formatDate(day.date)}</p>
              <p className="text-xl font-bold mb-1">{day.temp}°C</p>
              <p className="text-gray-600">{day.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherForecast;
