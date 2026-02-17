import request from "supertest";
import app from "../app.js";

describe("Location API", () => {

  let locationId;

  it("should create a new location", async () => {
    const res = await request(app)
      .post("/api/locations")
      .send({
        name: "London",
        country: "UK",
        latitude: 51.5074,
        longitude: -0.1278
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    locationId = res.body.data.id;
  });

  it("should get all locations", async () => {
    const res = await request(app)
      .get("/api/locations");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update a location", async () => {
    const res = await request(app)
      .put(`/api/locations/${locationId}`)
      .send({ is_favorite: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.is_favorite).toBe(true);
  });

  it("should delete a location", async () => {
    const res = await request(app)
      .delete(`/api/locations/${locationId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
