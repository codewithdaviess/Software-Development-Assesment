import request from "supertest";
import app from "../app.js";

describe("Weather API", () => {

  it("should fetch current weather", async () => {
    const res = await request(app)
      .get("/api/weather/London");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
