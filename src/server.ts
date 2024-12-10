// server k joto connection ache sob server.ts e thakbe.

import { Server } from "http";
import app from "./app";
import config from "./app/config";

const port=1000;

//mongoose er sathe connection o server.ts e thakbe

const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.PORT)
console.log(process.env.DB_URL)

let server: Server;

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL as string);

    // app.listen(config.port, () => {
    //   console.log(`Example app listening on port ${config.port}`);
    // });
    server = app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//for async
process.on('unhandledRejection', () => {
  console.log(`UnhandledPromiseRejection is detected, shutting down..`)
  if(server) {
    server.close(() => {
      process.exit(1);
    })
  }
  process.exit(1);
})

//for sync
process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected, shutting down..`)

  process.exit(1);
})

// console.log(x)