import express, { Request, Response } from "express";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const checkoutRouter = express.Router();

checkoutRouter.post("/", async (req: Request, res: Response) => {
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  try {
    const checkoutDto = {
      orderId: req.body.orderId,
      amount: req.body.amount,
    };

    const invoiceDto = {
      name: req.body.name,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      items: req.body.items,
    };

    const paymentOutput = await paymentFacade.process(checkoutDto);

    const invoiceOutput = await invoiceFacade.generate(invoiceDto);

    res.send({ ...paymentOutput, ...invoiceOutput });
  } catch (err) {
    res.status(500).send(err);
  }
});
