// controllers/location.controller.js
import pool from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

// Helper to handle axios errors
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

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: CRUD operations for locations
 */

/**
 * Create a location (auto-fetch coordinates if missing)
 */
export const createLocation = async (req, res, next) => {
  try {
    let { name, country, latitude, longitude, is_favorite } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "City name is required" });
    }

    // Auto-fetch coordinates if missing
    if (!latitude || !longitude) {
      const response = await axios.get(
        `${GEO_BASE_URL}/direct?q=${encodeURIComponent(name)}&limit=1&appid=${OPENWEATHER_API_KEY}`,
      );

      if (!response.data.length) {
        return res
          .status(404)
          .json({
            success: false,
            message: "City not found in OpenWeatherMap API",
          });
      }

      latitude = response.data[0].lat;
      longitude = response.data[0].lon;
      country = country || response.data[0].country;
    }

    const result = await pool.query(
      `INSERT INTO locations (name, country, latitude, longitude, is_favorite)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, country, latitude, longitude, is_favorite || false],
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all locations
 */
export const getLocations = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM locations WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single location by ID
 */
export const getLocationById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid location ID" });
    }

    const result = await pool.query(
      `SELECT * FROM locations WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * Get favorite locations
 */
export const getFavoriteLocations = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM locations WHERE deleted_at IS NULL AND is_favorite = true ORDER BY created_at DESC`,
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a location
 */
export const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    const result = await pool.query(
      `UPDATE locations SET name = COALESCE($1,name), is_favorite = COALESCE($2,is_favorite)
       WHERE id=$3 RETURNING *`,
      [name, is_favorite, id],
    );
    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * Soft delete a location
 */
export const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE locations
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id],
    );
    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });

    // Reset the sequence to start from the max ID + 1
    await pool.query(
      `SELECT SETVAL('locations_id_seq', (SELECT MAX(id) FROM locations WHERE deleted_at IS NULL) + 1)`
    );

    res.json({ success: true, message: "Location soft-deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * Search cities by name (autocomplete)
 */
export const searchCity = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ success: false, message: "Query parameter 'q' is required" });

    const url = `${GEO_BASE_URL}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);
    const cities = response.data.map((city) => ({
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lon,
    }));

    res.json({ success: true, data: cities });
  } catch (err) {
    handleAxiosError(err);
    next(err);
  }
};
