import request from "supertest";

import { app, sequelize } from "../express";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should process a client checkout", async () => {
    const input = {
      name: "Invoice name",
      document: "document example",
      street: "street example",
      number: "number example",
      complement: "complement example",
      city: "city example",
      state: "state example",
      zipCode: "zipCode example",
      orderId: "order-1",
      amount: 30,
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        },
      ],
    };

    const response = await request(app).post("/checkout").send(input);

    expect(response.status).toBe(200);
  });

  it("should not process a client checkout", async () => {
    const input = {
      name: "Invoice name",
      document: "document example",
      street: "street example",
      number: "number example",
      complement: "complement example",
      zipCode: "zipCode example",
      orderId: "order-1",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        },
      ],
    };

    const response = await request(app).post("/checkout").send(input);

    expect(response.status).toBe(500);
  });
});
