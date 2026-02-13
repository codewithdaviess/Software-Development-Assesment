import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Locations
export const getLocations = () => axios.get(`${BASE_URL}/locations`);
export const createLocation = (data) => axios.post(`${BASE_URL}/locations`, data);
export const updateLocation = (id, data) => axios.patch(`${BASE_URL}/locations/${id}`, data);
export const deleteLocation = (id) => axios.delete(`${BASE_URL}/locations/${id}`);
export const getLocationById = (id) => axios.get(`${BASE_URL}/locations/${id}`);
export const getFavoriteLocations = () => axios.get(`${BASE_URL}/locations/favorites`);
export const searchCity = (query) => axios.get(`${BASE_URL}/locations/search?q=${encodeURIComponent(query)}`);

// Weather
export const getWeather = (city) => axios.get(`${BASE_URL}/weather/${encodeURIComponent(city)}`);
export const getForecast = (city) => axios.get(`${BASE_URL}/weather/forecast/${encodeURIComponent(city)}`);
