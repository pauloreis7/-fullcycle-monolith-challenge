import request from "supertest";

import { app, sequelize } from "../express";

describe("E2E test for invoices", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
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

    const checkoutResponse = await request(app).post("/checkout").send(input);

    const response = await request(app).get(
      `/invoices/${checkoutResponse.body.id}`
    );

    expect(response.status).toBe(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual(input.name);
    expect(response.body.document).toEqual(input.document);
    expect(response.body.address.city).toEqual(input.city);
    expect(response.body.address.complement).toEqual(input.complement);
    expect(response.body.address.number).toEqual(input.number);
    expect(response.body.address.state).toEqual(input.state);
    expect(response.body.address.street).toEqual(input.street);
    expect(response.body.address.zipCode).toEqual(input.zipCode);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].id).toBe(input.items[0].id);
    expect(response.body.items[0].name).toBe(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toBe(input.items[1].id);
    expect(response.body.items[1].name).toBe(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);
    expect(response.body.createdAt).toBeDefined();
  });

  it("should not find an invoice", async () => {
    const response = await request(app).get("/invoices/fake-id");

    expect(response.status).toBe(500);
  });
});
