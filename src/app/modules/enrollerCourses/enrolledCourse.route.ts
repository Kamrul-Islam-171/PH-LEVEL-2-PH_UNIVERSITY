import express from 'express';

import ValidateRequest from '../../middlewares/validateRequests';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import Auth from '../../middlewares/auth';


const router = express.Router();

router.post(
  '/create-enrolled-course',
  Auth('student'),
  ValidateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  // Auth('faculty'),
  Auth('student'),
  ValidateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;