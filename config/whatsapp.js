require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const myPhoneNumber = `${process.env.DEFAULT_PHONE_NUMBER}@c.us`;
const notifyMyIfInitialize = process.env.INIT_NOTIFY === '1';

const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

whatsapp.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

whatsapp.on("ready", async () => {
  try {
    
    // Test Notif
    if (notifyMyIfInitialize) {
      await whatsapp.sendMessage(myPhoneNumber, "Client is ready!");
    }
  } catch (err) {
    console.error("Error on Ready:", err);
  }
});

whatsapp.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

whatsapp.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

whatsapp.initialize();

module.exports = whatsapp;
