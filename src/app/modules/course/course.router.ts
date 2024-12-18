import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import Auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-course",
  ValidateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get("/:id", CourseControllers.getSingleCourse);

router.patch(
  "/:id",
  ValidateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);
router.put(
  "/:courseId/assign-faculties",
  ValidateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

router.delete("/:id", CourseControllers.deleteCourse);

// router.put(
//   '/:courseId/assign-faculties',
//   validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
//   CourseControllers.assignFacultiesWithCourse,
// );

router.delete(
  '/:courseId/remove-faculties',
  ValidateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.get("/", Auth(), CourseControllers.getAllCourses);

export const CourseRoutes = router;
