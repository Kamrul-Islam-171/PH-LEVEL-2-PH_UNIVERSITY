import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";


const router = express.Router();

router.post(
  "/create-offered-course",
  ValidateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse
);

router.patch(
  '/:id',
  ValidateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

export const offeredCourseRoutes = router;
