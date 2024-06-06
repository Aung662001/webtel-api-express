const express = require("express");
const TableRouter = express.Router();
const { dbConnect, dbConfig } = require("../connections/dbConnection");
const { getTableItems } = require("../querys/querys");
TableRouter.get("/:floorId", (req, res) => {
  let connections = dbConnect(dbConfig);
  let floorId = req.params.floorId;
  try {
    let sql = `SELECT his.*, s.paid AS status,s.countid FROM fb_tables
                his LEFT JOIN (
                SELECT count(product_id) AS countid,table_id,paid FROM order_details
                WHERE ifnull(paid,0)=0 GROUP BY table_id,paid) AS
                s ON his.id=s.table_id
                WHERE ifnull(s.paid,0)=0 AND his.table_type_id = ${floorId} ORDER BY table_no `;
    connections.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(500).json({ message: "no data found!" });
        console.log(err.message)
      }
      return res.status(200).json(rows);
    });
  } catch (error) {
    res.status(500).json({ message: "no data found!" });
  }
});

TableRouter.get("/getTableItems/:table_id", (req, res) => {
  let table_id = req.params.table_id;
  let connection = dbConnect(dbConfig);
  let sql = getTableItems(table_id);
  try {
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Cann't get table items." + err.message });
      }
      return res.status(200).json(rows);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = { TableRouter };
