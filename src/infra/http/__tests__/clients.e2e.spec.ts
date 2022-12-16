import request from "supertest";

import { app, sequelize } from "../express";

describe("E2E test for clients", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    });

    expect(response.status).toBe(200);
  });

  it("should not create a client", async () => {
    const response = await request(app).post("/clients").send({
      id: "1",
      name: "Client 1",
    });

    expect(response.status).toBe(500);
  });
});
