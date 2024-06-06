const express = require("express");
const ProductRouter = express.Router();
const { dbConnect, dbConfig } = require("../connections/dbConnection");

ProductRouter.post("/", (req, res) => {
  let connections = dbConnect(dbConfig);
  const { categoryId, searchText } = req.body;
  let sql = "";
  let filter = "";
  if (categoryId) {
    filter = `AND his.category_id = ${categoryId}`;
  }
  sql += `SELECT his.*,c.restaurant,p.name AS order_printer_name 
    FROM products his LEFT JOIN categories c ON his.category_id=c.id 
    LEFT JOIN printers p ON his.order_printer_id=p.id
    WHERE his.name like '%${searchText}%' AND c.restaurant = 1 ${filter} ORDER BY his.name
    `;
  try {
    connections.query(sql, (err, rows, fields) => {
      if (err) {
        return res.status(500).json({ message: "Failed to get products." });
      }
      return res.status(200).json(rows);
    });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong!" });
  }
});

module.exports = { ProductRouter };
