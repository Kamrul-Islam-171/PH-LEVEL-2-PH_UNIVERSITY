import { NextFunction, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.route";
import { UserRoutes } from "./app/modules/users/users.route";
import { error } from "console";
import globalErrorHandler from "./app/middlewares/globalErrorHandeler";
import notFound from "./app/middlewares/notFound";
import router from "./app/route";

const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

//application routes

app.use("/api/v1/students", StudentRoutes);
// app.use('/api/v1/users', UserRoutes);
app.use("/api/v1", router);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

const test = async (req: Request, res: Response) => {
  // Promise.reject();


  // const a = 10;
  // res.send(a);
};
app.get('/', test);

//global error
app.use(globalErrorHandler);
app.use(notFound);

export default app;
