import express, { Request, Response } from "express";

import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoicesRouter = express.Router();

invoicesRouter.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const invoiceDto = {
      id: req.params.id,
    };

    const output = await facade.find(invoiceDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
