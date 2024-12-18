import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import Auth from "../../middlewares/auth";



const router = express.Router();

router.post(
  "/create-academic-department",
  // ValidateRequest(
  //   AcademicDepartmentValidations.CreateAcademicDepartmentValidationSchema
  // ),
  AcademicDepartmentController.CreateAcademicDepartment
);

router.get(
  "/", Auth(),
  AcademicDepartmentController.GetAllAcademicDepartment
);



export const AcademicDepartmentRoutes = router;
