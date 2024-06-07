import express from 'express';
import { dbConnect, dbConfig } from "../connections/dbConnection.js";
export const OrderRouter = express.Router();
import {
  updatePrintStatus,
  insertOrderDetails,
  getTableData,
  orderCancel,
  getBarPrintData,
  getKitchenPrinterData,
  getKitchenPrintCancelData,
  getBarPrintCancelData,
} from "../querys/querys.js";
import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
import {
  printOrderFormat,
  printOrderFormatKitchen,
  printOrderCancelFormat,
  printOrderCancelFormatKitchen,
} from "../printer/prepareItems.js";
import { getOrderSerialNo } from "../models/Model_voucherno.js";

OrderRouter.post("/createOrders/:isPrint", (req, res) => {
  const { isPrint } = req.params;
  const { cartItems, table } = req.body;

  let connections = dbConnect(dbConfig);
  try {
    // Insert order details
    const insertPromises = cartItems.map((item) => {
      const sql = insertOrderDetails(table.id, item);
      return connections.query(sql);
    });

    Promise.all(insertPromises)
      .then(() => {
        if (isPrint == 1) {
          printOrders(table, connections);
        } else {
          setPrinted(table.id, connections);
        }
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Orders created successfully" });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Failed to create orders." });
      });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create orders." });
  }
});

OrderRouter.post("/cancelOrder", async (req, res) => {
  const { table, item } = req.body;
  let connection = dbConnect(dbConfig);
  if (!table.id || !item)
    return res
      .status(400)
      .json({ message: "Need Table Id and Order Id to Cancel Order!" });
  let sql = orderCancel(item.id, table.id);
  await printOrderCancel(table, item, connection);
  try {
    connection.query(sql, (err, rows, fields) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json({ message: "Order deleted successfully!" });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
OrderRouter.post("/tableChange", async (req, res) => {
  const { item, fromTable, toTable, qty } = req.body;
  let connection = dbConnect(dbConfig);
  try {
    let sql = `Update order_details SET qty=qty-${qty}, amount=qty*(price-discount)
    WHERE table_id=${fromTable.id} 
    AND id = ${item.id} AND paid=0`;

    connection.query(sql);
    sql = `INSERT INTO order_details (table_id,product_id,qty,smallest_qty,unit_type,
      price,amount,paid,printed,discount,foc) 
      SELECT ${toTable.id},product_id,${qty},${qty},unit_type,
      price,${qty}*(price-discount),paid,printed,discount,foc FROM order_details
      WHERE table_id=${fromTable.id} AND id=${item.id} `;
    connection.query(sql, (err, rows, fields) => {
      if (err) return res.status(500).json({ message: err.message });
      sql = `DELETE FROM order_details WHERE 
            table_id = ${fromTable.id} 
            AND id = ${item.id} 
            AND paid = 0
            AND qty <= 0`;
      connection.query(sql);
      return res.status(200).json({ message: "Order change success!" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});
OrderRouter.post("/changeAllItems", async (req, res) => {
  const { fromTable, toTable } = req.body;
  let sql = `Update order_details SET table_id=${toTable.id} WHERE table_id=${fromTable.id}
      AND id IN (SELECT his.id FROM order_details his 
      WHERE his.table_id = ${fromTable.id} AND ifnull(paid,0)=0)`;
  let connection = dbConnect(dbConfig);
  connection.query(sql, (err, rows, fields) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json({ message: "Successfully changed" });
  });
});

const printOrders = async (table, connection) => {
  let sql = `SELECT ip_address AS return1 FROM printers WHERE id= 1`;
  let serialNo = await getOrderSerialNo();
  let status = "";
  await connection.query(sql, async (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    let ip_address = rows[0].return1;
    let sql = getBarPrintData(table.id);
    connection.query(sql, async (err, rows, fields) => {
      sql = `SELECT count(id) AS count FROM order_details 
      WHERE table_id= ${table.id} AND printed=1`;
      let orderItems = rows;
      connection.query(sql, async (err, rows, fields) => {
        // if (err) return;
        status = rows[0].count <= 0 ? "New Order" : "Add to";
        let printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: "tcp://" + ip_address,
          timeout: 5000,
        });
        await printOrderFormat(
          printer,
          orderItems,
          status,
          serialNo,
          table
        );
      });
    });
  });
  // print to kitchen
  sql = `SELECT ip_address AS return1 FROM printers WHERE id= 2`;
  await connection.query(sql, async (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    let ip_address = rows[0].return1;
    let sql = getKitchenPrinterData(table.id);
    connection.query(sql, async (err, rows, fields) => {
      sql = `SELECT count(id) AS count FROM order_details 
      WHERE table_id= ${table.id} AND printed=1`;
      let orderItems = rows;
      if (!orderItems || !ip_address) {
        setPrinted(table.id, connection);
        return;
      }
      connection.query(sql, async (err, rows, fields) => {
        // if (err) return;
        status = rows[0].count <= 0 ? "New Order" : "Add to";
        let printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: "tcp://" + ip_address,
          timeout: 5000,
        });
        await printOrderFormatKitchen(
          printer,
          orderItems,
          status,
          serialNo,
          table
        );
      });
      setPrinted(table.id, connection);
    });
  });
};
const printOrderCancel = async (table, item, connection) => {
  let status = "CANCEL";
  let sql = `SELECT ip_address AS return1 FROM printers WHERE id= 1`;
  await connection.query(sql, async (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    let ip_address = rows[0].return1;
      let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: "tcp://" + ip_address,
        timeout: 5000,
      });
      console.log(item)
      await printOrderCancelFormat(printer, [item], status, table);
  });
  // print to kitchen 
  sql = `SELECT ip_address AS return1 FROM printers WHERE id= 2`;
  await connection.query(sql, async (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    let ip_address = rows[0].return1;
      if ( item.printer!==2 || !ip_address) {
        return;
      }
      let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: "tcp://" + ip_address,
        timeout: 5000,
      });
      await printOrderCancelFormatKitchen(
        printer,
        [item],
        status,
        table);
  });
};

const setPrinted = (table_id, connection) => {
  // Update print status
  const updateSql = updatePrintStatus(table_id);
  connection.query(updateSql);
};

// module.exports = { OrderRouter };
