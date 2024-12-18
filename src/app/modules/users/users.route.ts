import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./users.controller";
import { AnyZodObject } from "zod";
import { studentZodValidations } from "../student/student.zod.validation";
import ValidateRequest from "../../middlewares/validateRequests";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import Auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

//higher order + middleware function
// const senaBahini = (name: string) => {
//     return async(req: Request, res:Response, next: NextFunction) => {
//         console.log(name);
//     }
// }

//higher order + middleware function
// const ValidateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//       });
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// router.post('/create-student', senaBahini("kamrul islam"), UserController.createStudent);
router.post(
  "/create-student",
  Auth(USER_ROLE.admin),
  ValidateRequest(studentZodValidations.CreatestudentZodValidationSchema),
  UserController.createStudent
);

router.post(
  '/create-faculty',
  Auth(USER_ROLE.admin),
  ValidateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);


export const UserRoutes = router;
