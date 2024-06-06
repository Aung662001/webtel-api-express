const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const date = require("date-and-time");
const now = new Date();
const textToImage = require("text-to-image");
const path = require("path");
const fs = require("fs");
const { registerFont , createCanvas, loadImage} = require("canvas");
// const { table, getBorderCharacters } = require("table");
const stringWidth = require("string-width");
var Table = require("cli-table");
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

let orderItems = [
  {
    name: "testing testing testing testing testing testing testing",
    remark: "hello world!",
    qty: 1,
  },
  {
    name: "testing testing Hello How are You testing",
    remark: "hello world!",
    qty: 10,
  },
  {
    name: "testing",
    remark: "hello world!",
    qty: 8,
  },
  {
    name: "ေဆးဖ်န္းေခါင္းေဆးဖ်န္း",
    remark: " ",
    qty: 1,
  },
];

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: "tcp://192.168.100.30",
  timeout: 5000,
});

const imageConverter = async (text) => {
  await textToImage.generate(text.replaceAll(" ", "\u00A0"), {
    debug: true,
    debugFilename: path.join("assets/imgs/", "output.png"),
    maxWidth: 550,
    fontSize: 24,
    fontFamily: "Zawgyi",
    lineHeight: 30,
    bgColor: "white",
    textColor: "black",
  });
};

function insertLineBreaks(inputString, maxWidth, lineHeights) {
  const words = inputString.split(" ");
  let currentLine = "";
  const lines = [];

  for (const word of words) {
    const wordWidth = stringWidth(word);

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

  return lines.join("\n"); // Join lines with line breaks
}

const insertQtyToImage = (X, Y, lineHeights, path,qtys) => {
  console.log(lineHeights)
  console.log(qtys)
  loadImage(path).then((img) => {
    // (C1) CREATE CANVAS
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    // (C2) DRAW IMAGE ONTO CANVAS
    ctx.drawImage(img, 0, 0);
    
    qtys.forEach((qty,index) => {
      // (C3) WRITE TEXT ONTO IMAGE
      ctx.font = '24px "Zawgyi"'
      ctx.fillText(qty, X, Y);
      Y = Y + (lineHeights[index] * 30);
    });

    // (C4) SAVE
    const out = fs.createWriteStream(path);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    // out.on("finish", () => console.log("Done"));
  });
};
const printOrder = async () => {
  let lineHeights = [];
  let qtys = [];
  let X = 500;
  let Y =40;
  printer.alignCenter();
  printer.bold(true);
  printer.println("Man Myanmar Hotel");
  printer.bold(false);
  printer.leftRight("Table Name: Dinning [ D-03 ]", "KITCHEN");
  printer.bold(true);
  printer.drawLine();
  printer.tableCustom([
    { text: "No", align: "LEFT", width: 0.15 },
    { text: "Items", align: "LEFT", width: 0.7 },
    { text: "Qty", align: "LEFT", width: 0.15 },
  ]);
  printer.bold(false);
  // items
  let finalString = "";
  orderItems.forEach(async (item, index) => {
    let no = index + 1 + ". ";
    let itemName = no + item.name + " [*" + item.remark + "*]";

    // finalString += insertLineBreaks(itemName, 40, item.qty) + "\n\n";
  });
  const x = 10; // X position
  const y = 10; // Y position
  const font = "Zawgyi"; // Font name
  const fontSize = 24; // Font size
  const outputPath = "assets/imgs/output.png";

  let tableData = [];
  orderItems.forEach((item, index) => {
    let no = index + 1 + ". ";
    let arr = [];
    let itemName = item.name + " [*" + item.remark + "*]";

    arr.push(no, insertLineBreaks(itemName, 38, lineHeights), "");
    qtys.push(item.qty);
    table.push(arr);
  });

  await imageConverter(table.toString());
  insertQtyToImage(X, Y, lineHeights, outputPath, qtys);
  await printer.printImage(outputPath);
  // end items
  // footer
  printer.drawLine();
  printer.leftRight(
    "Date : " + date.format(now, "YYYY/MM/DD HH:mm:ss"),
    "yewinhtut"
  );
  printer.leftRight("Status : " + "Add to", "TockenNo: " + "1");
  // end footer
  printer.cut();
  printer.execute();
};
try {
  printOrder();
  console.log("Print done!");
} catch (error) {
  console.error("Print failed:", error);
}
