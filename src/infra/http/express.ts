import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import OrderItem from "../../modules/invoice/repository/order-item.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { productsRouter } from "./routes/products.routes";
import { clientsRouter } from "./routes/clients.routes";

export const app: Express = express();

app.use(express.json());

app.use("/products", productsRouter);
app.use("/clients", clientsRouter);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    ClientModel,
    InvoiceModel,
    ProductModel,
    OrderItem,
    TransactionModel,
  ]);
  await sequelize.sync();
}

setupDb();
