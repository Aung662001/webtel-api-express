const express = require("express");
require("dotenv").config();
const { dbConnect, dbConfig } = require("./connections/dbConnection");
const cors = require("cors");
const { TableRouter } = require("./routers/Table");
const { ProductRouter } = require("./routers/Product");
const { OrderRouter } = require("./routers/Order");

const app = express();
const PORT = process.env.PORT || 8877;

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/tables", TableRouter);
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);

app.get("/floors", (req, res) => {
  try {
    let connections = dbConnect(dbConfig);
    connections.query(`select * from fb_table_types `, (err, rows, fields) => {
      if (err) {
        return res.status(500).json({ message:"Failed!"+ err.message });
      }
      return res.status(200).json(rows);
    });
  } catch(err) {
    res.status(500).json({ message: "no data found!!"+err.message });
  }
});

app.get("/categories", (req, res) => {
  // const { catId } = req.params;
  let connections = dbConnect(dbConfig);
  let sql;
  // sql = `SELECT * FROM categories his WHERE id = ${catId}`;
  sql = `SELECT his.*,b.name AS branch_name,s.name AS location_name 
    FROM categories his LEFT JOIN branches b ON his.branch_id=b.id 
    LEFT JOIN stores s ON his.stock_location_id=s.id  
    WHERE ifnull(his.restaurant,0)=1 `;
  try {
    connections.query(sql, (err, rows, fields) => {
      if (err) {
        res.status(500).json({ message: "Failed to get categories." });
      }
      return res.status(200).json(rows);
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to get categories." });
  }
});


app.listen(PORT, function () {
  console.log("Server listening on port : " + PORT);
});
