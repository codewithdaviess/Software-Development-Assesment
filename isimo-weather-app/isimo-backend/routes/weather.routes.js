import express from "express";
import { getWeather, getForecast } from "../controllers/weather.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather information
 */

/**
 * @swagger
 * /api/weather/{city}:
 *   get:
 *     summary: Get current weather
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current weather data
 */

/**
 * @swagger
 * /api/weather/forecast/{city}:
 *   get:
 *     summary: Get 5-day forecast
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 5-day forecast data
 */

router.get("/forecast/:city", getForecast);
router.get("/:city", getWeather);

export default router;
