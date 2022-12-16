import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import OrderItemModel from "../repository/order-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
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
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice name",
      document: "document example",
      street: "street example",
      number: "number example",
      complement: "complement example",
      city: "city example",
      state: "state example",
      zipCode: "zipCode example",
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

    const result = await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: result.id },
      include: ["items"],
    });

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toEqual(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.street).toEqual(input.street);
    expect(invoice.number).toEqual(input.number);
    expect(invoice.complement).toEqual(input.complement);
    expect(invoice.city).toEqual(input.city);
    expect(invoice.state).toEqual(input.state);
    expect(invoice.zipCode).toEqual(input.zipCode);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
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
    };

    const invoice = await InvoiceModel.create(input, {
      include: [{ model: OrderItemModel }],
    });

    const result = await facade.find({ id: input.id });

    expect(result).toBeDefined();
    expect(result.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(invoice.items[0].id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.createdAt).toStrictEqual(invoice.createdAt);
  });
});
