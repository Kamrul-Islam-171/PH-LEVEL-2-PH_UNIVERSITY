import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import { AcademicFacultyController } from "./academicFaculty.controller";


const router = express.Router();

router.post(
  "/create-academic-faculty",
  ValidateRequest(
    AcademicFacultyValidations.CreateAcademicFacultyValidationSchema
  ),
  AcademicFacultyController.CreateAcademicFaculty
);



export const AcademicFacultyRoutes = router;
