import express from "express";
import { AcademicSemesterController } from "./academicSemester.controller";
import ValidateRequest from "../../middlewares/validateRequests";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create-academic-semester",
  ValidateRequest(
    AcademicSemesterValidations.CreateAcademicSemesterValidationSchema
  ),
  AcademicSemesterController.CreateAcademicSemester
);

// router.get('/', StudentControllers.GetSdudents);
// router.get('/:studentID', StudentControllers.GetSingleSdudents);
// router.delete('/:studentID', StudentControllers.DeleteSingleSdudents);

export const AcademicSemesterRoutes = router;
