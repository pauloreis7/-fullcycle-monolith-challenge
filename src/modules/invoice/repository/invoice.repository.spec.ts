import { Sequelize } from "sequelize-typescript";

import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import Invoice from "../domain/invoice.entity";
import OrderItem from "../domain/order-item.entity";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import OrderItemModel from "./order-item.model";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, OrderItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const address = new Address({
      street: "street example",
      number: "number example",
      complement: "complement example",
      city: "city example",
      state: "state example",
      zipCode: "zipCode example",
    });

    const orderItem = new OrderItem({
      name: "Product 1",
      price: 10,
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "document example",
      address,
      items: [orderItem],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: ["items"],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items).toHaveLength(1);
    expect(invoiceDb.items[0].id).toBe(orderItem.id.id);
    expect(invoiceDb.items[0].name).toBe(orderItem.name);
    expect(invoiceDb.items[0].price).toBe(orderItem.price);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "document example",
        street: "street example",
        number: "number example",
        complement: "complement example",
        city: "city example",
        state: "state example",
        zipCode: "zipCode example",
        createdAt: new Date(),
        updatedAt: new Date(),
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
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result).toBeDefined();
    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id.id).toBe(invoice.items[0].id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id.id).toBe(invoice.items[1].id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.createdAt).toStrictEqual(invoice.createdAt);
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt);
  });
});
