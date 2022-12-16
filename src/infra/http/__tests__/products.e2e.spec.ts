import request from "supertest";

import { app, sequelize } from "../express";

describe("E2E test for products", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product example",
      description: "Product description example",
      purchasePrice: 10,
      stock: 5,
    });

    expect(response.status).toBe(200);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product example",
      description: "Product description example",
    });

    expect(response.status).toBe(500);
  });
});
