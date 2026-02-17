// services/weather.service.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) throw new Error("OPENWEATHER_API_KEY not set in .env");

const handleAxiosError = (err) => {
  if (err.response) {
    if (err.response.status === 401) throw new Error("Invalid API key");
    if (err.response.status === 404) throw new Error("City not found");
    if (err.response.status === 429) throw new Error("Rate limit exceeded");
    throw new Error(`Weather API error: ${err.response.statusText}`);
  } else if (err.request) {
    throw new Error("No response from weather API");
  } else {
    throw new Error(`Weather service error: ${err.message}`);
  }
};

export const fetchWeather = async (city) => {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};

export const fetchForecast = async (city) => {
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);

    const list = response.data.list || [];
    const dailyForecast = list
      .filter(item => item.dt_txt && item.dt_txt.includes("12:00:00"))
      .map(item => ({
        date: item.dt_txt.split(" ")[0],
        temp: item.main.temp,
        weather: item.weather[0].description,
      }));

    return {
      city: response.data.city?.name || city,
      forecast: dailyForecast.length ? dailyForecast : []
    };
  } catch (err) {
    handleAxiosError(err);
  }
};

