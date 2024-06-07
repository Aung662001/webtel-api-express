function insertOrderDetails(tableId, item) {
  const { id, qty, sale_price, amount, remark } = item;
  const sql = `INSERT INTO order_details (table_id, product_id, qty, unit_type, price, amount, remark)
                 VALUES (${tableId}, ${id}, ${qty}, 1, ${sale_price}, ${amount}, '${remark}');`;
  return sql;
}
function cancelOrderDetails(id) {}
function updatePrintStatus(tableId) {
  const sql = `UPDATE order_details SET printed = 1 WHERE table_id = ${tableId}`;
  return sql;
}

function getTableData(tableId, connection) {
  if (tableId) {
    let sql = `SELECT his.*,t.name AS table_type_name  FROM fb_tables his 
					LEFT JOIN fb_table_types t ON his.table_type_id=t.id  WHERE his.id = ${tableId}`;
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        console.log(err);
      }
      return rows[0];
    });
  }
}
function getTableItems(tableId) {
  return `SELECT his.id,his.product_id,his.qty,p.short_name,p.product_code AS code,p.order_printer_id as printer ,
				p.product_name AS name, p.smallest_unit_qty ,p.unit_type,p.unit_id, 
				his.price,his.amount,his.remark,his.foc,his.discount,1 to_qty  FROM order_details his 
				LEFT JOIN productunitviews p ON his.product_id=p.product_id 
				WHERE p.unit_type=1 AND his.table_id = ${tableId} AND ifnull(paid,0)=0`;
}
function orderCancel(order_id, table_id) {
  return `DELETE FROM order_details WHERE table_id=${table_id} AND id=${order_id} `;
}
function getBarPrintData(table_id) {
  return `SELECT his.product_id,his.qty,p.short_name,p.product_code AS code, 
  p.product_name AS name, p.smallest_unit_qty ,p.unit_type,p.unit_id, 
  his.price,his.amount,his.remark  FROM order_details his 
  LEFT JOIN productunitviews p ON his.product_id=p.product_id 
  WHERE p.unit_type=1 AND his.table_id = ${table_id} AND ifnull(paid,0)=0 
  AND ifnull(printed,0)=0 ORDER BY his.id `;
}
function getKitchenPrinterData(table_id){
  return `SELECT his.product_id,his.qty,p.short_name,p.product_code AS code, 
  p.product_name AS name, p.smallest_unit_qty ,p.unit_type,p.unit_id, 
  his.price,his.amount,his.remark  FROM order_details his 
  LEFT JOIN productunitviews p ON his.product_id=p.product_id 
  WHERE p.unit_type=1 AND his.table_id = ${table_id} AND ifnull(paid,0)=0 
  AND p.order_printer_id=2 AND ifnull(printed,0)=0 ORDER BY his.id `;
}

function getBarPrintCancelData(table_id,order_id){
return `SELECT his.product_id,his.qty,p.short_name,p.product_code AS code, 
p.product_name AS name, p.smallest_unit_qty ,p.unit_type,p.unit_id, 
his.price,his.amount,his.remark  FROM order_details his 
LEFT JOIN productunitviews p ON his.product_id=p.product_id 
WHERE p.unit_type=1 AND his.table_id = ${table_id} AND ifnull(paid,0)=0 
AND his.id=${order_id} ORDER BY his.id `;
}

function getKitchenPrintCancelData(table_id,order_id){
  return `SELECT his.product_id,his.qty,p.short_name,p.product_code AS code, 
  p.product_name AS name, p.smallest_unit_qty ,p.unit_type,p.unit_id, 
  his.price,his.amount,his.remark  FROM order_details his 
  LEFT JOIN productunitviews p ON his.product_id=p.product_id 
  WHERE p.unit_type=1 AND his.table_id = ${table_id} AND ifnull(paid,0)=0 
  AND p.order_printer_id=2 AND his.id=${order_id} ORDER BY his.id `;
}
export {
  insertOrderDetails,
  updatePrintStatus,
  getTableData,
  getTableItems,
  orderCancel,
  getBarPrintData,
  getKitchenPrinterData,
  getBarPrintCancelData,
  getKitchenPrintCancelData
};
