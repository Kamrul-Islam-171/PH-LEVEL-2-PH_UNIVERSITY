import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./users.controller";
import { AnyZodObject } from "zod";
import { studentZodValidations } from "../student/student.zod.validation";
import ValidateRequest from "../../middlewares/validateRequests";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import Auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { Uservalidation } from "./users.validation";
import { upload } from "../../utils/sendImageToCloudinary";

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
  // Auth(USER_ROLE.admin),
  upload.single('file'),
  (req:Request, res:Response, next:NextFunction)=>{
    // vadlidate korar jonno json data lagbe. but amra to file hisebe patacchi.
    // tai ei middle ware e kaj korbo then validaterequest e jabo

    req.body = JSON.parse(req.body.data);

    //req.body er moddhe abar ager moto kore set korte pari taholei validate request data gula pabe

    next();
  },
  ValidateRequest(studentZodValidations.CreatestudentZodValidationSchema),
  UserController.createStudent
);

router.post(
  '/create-faculty',
  Auth(USER_ROLE.admin),
  ValidateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/change-status/:id',
  // Auth('admin'),
  ValidateRequest(Uservalidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get('/me',Auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty), UserController.getMe);

export const UserRoutes = router;
