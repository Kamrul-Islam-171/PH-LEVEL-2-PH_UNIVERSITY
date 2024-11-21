// server k joto connection ache sob server.ts e thakbe.

import app from "./app";
import config from "./app/config";

const port=1000;

//mongoose er sathe connection o server.ts e thakbe

const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.PORT)
console.log(process.env.DB_URL)

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL as string);

    // app.listen(config.port, () => {
    //   console.log(`Example app listening on port ${config.port}`);
    // });
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
