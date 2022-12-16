import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import StoreProductModel from "../../modules/store-catalog/repository/product.model";
import OrderItem from "../../modules/invoice/repository/order-item.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";

export const app: Express = express();

app.use(express.json());

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
    StoreProductModel,
    OrderItem,
    TransactionModel,
  ]);
  await sequelize.sync();
}

setupDb();
