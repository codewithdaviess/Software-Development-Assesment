import axios from "axios";
import pool from "../config/db.js";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeather = async (req, res, next) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: "metric" }
    });
    const data = response.data;
    const transformed = {
      main: {
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max
      },
      description: data.weather[0]?.description || "N/A",
      weatherType: data.weather[0]?.main || "Clear"
    };
    res.json({ success: true, data: transformed });
  } catch (err) {
    next(err);
  }
};

export const getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: API_KEY, units: "metric" }
    });
    const data = response.data;
    const forecastMap = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateKey = date.toISOString().split('T')[0];
      
      if (!forecastMap[dateKey]) {
        forecastMap[dateKey] = {
          day,
          temp: item.main.temp,
          type: item.weather[0]?.main || "Clear",
          description: item.weather[0]?.description || "N/A"
        };
      }
    });
    
    const forecast = Object.values(forecastMap);
    res.json({ success: true, data: forecast });
  } catch (err) {
    next(err);
  }
};
