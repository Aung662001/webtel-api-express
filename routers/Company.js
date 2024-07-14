import express from "express";
export const CompanyRouter = express.Router();
import { dbConnect, dbConfig } from "../connections/dbConnection.js";

CompanyRouter.get("/tax_and_service_charge", (req, res) => {
    let connections = dbConnect(dbConfig);
    let sql = "SELECT c.service_charge_value,c.vat_charge_value FROM company c";
    try {
        connections.query(sql, (err, rows, fields) => {
          if (err) {
            return res.status(500).json({ message: "Failed." });
          }
          return res.status(200).json(rows[0]);
        });
      } catch (error) {
        return res.status(500).send({ message: "Something went wrong!" });
      }
});
