import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientsRouter = express.Router();

clientsRouter.post("/", async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    };

    const output = await facade.add(clientDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
