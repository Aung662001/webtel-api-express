import { dbConnect, dbConfig } from "../connections/dbConnection.js";
import date from "date-and-time";
function getOrderSerialNo() {
    const now = date.format(new Date(), "YYYY/MM/DD");
    const connection = dbConnect(dbConfig);
  
    return new Promise((resolve, reject) => {
      connection.query("SELECT left_no AS return1 FROM order_serials", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
  
        let sql;
        if (rows[0].return1 !== now) {
          sql = `UPDATE order_serials SET left_no='${now}', serial_no=1`;
        } else {
          sql = `UPDATE order_serials SET serial_no=serial_no+1`;
        }
  
        connection.query(sql, (err) => {
          if (err) {
            reject(err);
            return;
          }
  
          connection.query("SELECT serial_no FROM order_serials", (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(rows[0].serial_no);
          });
        });
      });
    });
  }

export{ getOrderSerialNo };
