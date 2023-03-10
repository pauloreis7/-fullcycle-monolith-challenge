import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import Invoice from "../../domain/invoice.entity";
import OrderItem from "../../domain/order-item.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe(orderItem.id.id);
    expect(result.items[0].name).toBe(orderItem.name);
    expect(result.items[0].price).toBe(orderItem.price);
    expect(result.total).toEqual(invoice.total);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
