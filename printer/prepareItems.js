const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const date = require("date-and-time");
const now = new Date();
const textToImage = require("text-to-image");
const path = require("path");
const fs = require("fs");
const { registerFont, createCanvas, loadImage } = require("canvas");
// const { table, getBorderCharacters } = require("table");
const stringWidth = require("string-width");
var Table = require("cli-table");

const imageConverter = async (text, path) => {
  try {
    await textToImage.generate(text.replaceAll(" ", "\u00A0"), {
      debug: true,
      debugFilename: path,
      maxWidth: 550,
      fontSize: 24,
      fontFamily: "Zawgyi",
      lineHeight: 30,
      bgColor: "white",
      textColor: "black",
    });
  } catch (err) {
    console.log(err);
  }
};
const printOrderFormatKitchen = async (
  printer,
  orderItems,
  status,
  serialNo,
  orderTable
) => {
  var table = new Table({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: "",
    },
    colWidths: [5, 45, 5],
  });
  registerFont("assets/fonts/zawgyi-one.ttf", { family: "Zawgyi" });
  let lineHeights = [];
  let qtys = [];
  let X = 500;
  let Y = 40;
  printer.alignCenter();
  printer.bold(true);
  printer.println("Man Myanmar Hotel");
  printer.bold(false);
  printer.leftRight("Table Name: " + " [ " + orderTable.table_no + " ]", "Kitchen");
  printer.bold(true);
  printer.drawLine();
  printer.tableCustom([
    { text: "No", align: "LEFT", width: 0.15 },
    { text: "Items", align: "LEFT", width: 0.7 },
    { text: "Qty", align: "LEFT", width: 0.15 },
  ]);
  printer.bold(false);

  const x = 10; // X position
  const y = 10; // Y position
  const font = "Zawgyi"; // Font name
  const fontSize = 24; // Font size
  const outputPath = "assets/imgs/output1.png";

  orderItems.forEach((item, index) => {
    let no = index + 1 + ". ";
    let arr = [];
    let itemName = item.name + " [*" + item.remark + "*]";

    arr.push(no, insertLineBreaks(itemName, 38, lineHeights), "");
    qtys.push(item.qty);
    table.push(arr);
  });

  await imageConverter(table.toString(), outputPath);
  await insertQtyToImagePromise(X, Y, lineHeights, outputPath, qtys);
  await printer.printImage(outputPath);
  // end items
  // footer
  printer.drawLine();
  printer.leftRight(
    "Date : " + date.format(now, "YYYY/MM/DD HH:mm:ss"),
    "Tablet"
  );
  printer.leftRight("Status : " + status, "TockenNo: " + serialNo);
  // end footer
  printer.cut();
  printer.execute();
};

const printOrderFormat = async (
  printer,
  orderItems,
  status,
  serialNo,
  orderTable
) => {
  var table = new Table({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: "",
    },
    colWidths: [5, 45, 5],
  });
  registerFont("assets/fonts/zawgyi-one.ttf", { family: "Zawgyi" });
  let lineHeights = [];
  let qtys = [];
  let X = 500;
  let Y = 40;
  printer.alignCenter();
  printer.bold(true);
  printer.println("Man Myanmar Hotel");
  printer.bold(false);
  printer.leftRight("Table Name: " + " [ " + orderTable.table_no + " ]", "Bar");
  printer.bold(true);
  printer.drawLine();
  printer.tableCustom([
    { text: "No", align: "LEFT", width: 0.15 },
    { text: "Items", align: "LEFT", width: 0.7 },
    { text: "Qty", align: "LEFT", width: 0.15 },
  ]);
  printer.bold(false);

  const x = 10; // X position
  const y = 10; // Y position
  const font = "Zawgyi"; // Font name
  const fontSize = 24; // Font size
  const outputPath = "assets/imgs/output.png";

  orderItems.forEach((item, index) => {
    let no = index + 1 + ". ";
    let arr = [];
    let itemName = item.name + " [*" + item.remark + "*]";

    arr.push(no, insertLineBreaks(itemName, 38, lineHeights), "");
    qtys.push(item.qty);
    table.push(arr);
  });

  await imageConverter(table.toString(), outputPath);
  await insertQtyToImagePromise(X, Y, lineHeights, outputPath, qtys);
  await printer.printImage(outputPath);
  // end items
  // footer
  printer.drawLine();
  printer.leftRight(
    "Date : " + date.format(now, "YYYY/MM/DD HH:mm:ss"),
    "Tablet"
  );
  printer.leftRight("Status : " + status, "TockenNo: " + serialNo);
  // end footer
  printer.cut();
  printer.execute();
};
const printOrderCancelFormatKitchen = async (
  printer,
  orderItems,
  status = "Cancel",
  orderTable
) => {
  var table = new Table({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: "",
    },
    colWidths: [5, 45, 5],
  });
  registerFont("assets/fonts/zawgyi-one.ttf", { family: "Zawgyi" });
  let lineHeights = [];
  let qtys = [];
  let X = 500;
  let Y = 40;
  printer.alignCenter();
  printer.bold(true);
  printer.println("Man Myanmar Hotel");
  printer.bold(false);
  printer.leftRight(
    "Table Name: " + " [ " + orderTable.table_no + " ]",
    "Kitchen"
  );
  printer.bold(true);
  printer.drawLine();
  printer.tableCustom([
    { text: "No", align: "LEFT", width: 0.15 },
    { text: "Items", align: "LEFT", width: 0.7 },
    { text: "Qty", align: "LEFT", width: 0.15 },
  ]);
  printer.bold(false);

  const outputPath = "assets/imgs/output1.png";

  orderItems.forEach((item, index) => {
    let no = index + 1 + ". ";
    let arr = [];
    let itemName = item.name + " [*" + item.remark + "***CANCEL***" + "*]";

    arr.push(no, insertLineBreaks(itemName, 38, lineHeights), "");
    qtys.push(item.qty);
    table.push(arr);
  });

  await imageConverter(table.toString(), outputPath);
  await insertQtyToImagePromise(X, Y, lineHeights, outputPath, qtys);
  await printer.printImage(outputPath);
  // end items
  // footer
  printer.drawLine();
  printer.leftRight(
    "Date : " + date.format(now, "YYYY/MM/DD HH:mm:ss"),
    "Tablet"
  );
  printer.leftRight("Status : " + status, " ");
  // end footer
  printer.cut();
  printer.execute();
};
const printOrderCancelFormat = async (
  printer,
  orderItems,
  status = "Cancel",
  orderTable
) => {
  var table = new Table({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: "",
    },
    colWidths: [5, 45, 5],
  });
  registerFont("assets/fonts/zawgyi-one.ttf", { family: "Zawgyi" });
  let lineHeights = [];
  let qtys = [];
  let X = 500;
  let Y = 40;
  printer.alignCenter();
  printer.bold(true);
  printer.println("Man Myanmar Hotel");
  printer.bold(false);
  printer.leftRight("Table Name: " + " [ " + orderTable.table_no + " ]", "Bar");
  printer.bold(true);
  printer.drawLine();
  printer.tableCustom([
    { text: "No", align: "LEFT", width: 0.15 },
    { text: "Items", align: "LEFT", width: 0.7 },
    { text: "Qty", align: "LEFT", width: 0.15 },
  ]);
  printer.bold(false);

  const x = 10; // X position
  const y = 10; // Y position
  const font = "Zawgyi"; // Font name
  const fontSize = 24; // Font size
  const outputPath = "assets/imgs/output.png";

  orderItems.forEach((item, index) => {
    let no = index + 1 + ". ";
    let arr = [];
    let itemName = item.name + " [*" + item.remark + "***CANCEL***" + "*]";

    arr.push(no, insertLineBreaks(itemName, 38, lineHeights), "");
    qtys.push(item.qty);
    table.push(arr);
  });

  await imageConverter(table.toString(), outputPath);
  await insertQtyToImagePromise(X, Y, lineHeights, outputPath, qtys);
  await printer.printImage(outputPath);
  // end items
  // footer
  printer.drawLine();
  printer.leftRight(
    "Date : " + date.format(now, "YYYY/MM/DD HH:mm:ss"),
    "Tablet"
  );
  printer.leftRight("Status : " + status, " ");
  // end footer
  printer.cut();
  printer.execute();
};

const insertQtyToImagePromise = (X, Y, lineHeights, path, qtys) => {
  return new Promise((resolve, reject) => {
    loadImage(path)
      .then((img) => {
        // (C1) CREATE CANVAS
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");

        // (C2) DRAW IMAGE ONTO CANVAS
        ctx.drawImage(img, 0, 0);

        qtys.forEach((qty, index) => {
          // (C3) WRITE TEXT ONTO IMAGE
          ctx.font = '24px "Zawgyi"';
          ctx.fillText(qty, X, Y);
          Y = Y + lineHeights[index] * 30;
        });

        // (C4) SAVE
        const out = fs.createWriteStream(path);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        // Resolve the promise when everything is done
        out.on("finish", () =>
          resolve("Image processing completed successfully.")
        );
      })
      .catch((error) => {
        // Reject the promise if any error occurs
        reject(`Error processing image: ${error}`);
      });
  });
};

function insertLineBreaks(inputString, maxWidth = 38, lineHeights) {
  const words = inputString.split(" ");
  let currentLine = "";
  const lines = [];

  for (const word of words) {
    if (stringWidth(currentLine + word) <= maxWidth) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }
  lineHeights.push(lines.length);

  return lines.join("\n");
}
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
module.exports = {
  printOrderFormat,
  printOrderCancelFormat,
  printOrderCancelFormatKitchen,
  printOrderFormatKitchen
};
