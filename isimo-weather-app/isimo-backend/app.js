import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import locationRoutes from "./routes/location.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Isimo API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }]
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/locations", locationRoutes);
app.use("/api/weather", weatherRoutes);

// Error middleware
app.use(errorHandler);

export default app;
