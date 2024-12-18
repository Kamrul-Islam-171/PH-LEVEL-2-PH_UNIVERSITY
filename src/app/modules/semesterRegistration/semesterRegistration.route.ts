import express from "express";
import ValidateRequest from "../../middlewares/validateRequests";
import { SemesterRegistrationValidations } from "./semesterRegistration.validtion";
import { SemesterRegistrationController } from "./semesterRegistration.controller";

const router = express.Router();

router.post(
  "/create-semester-registration",
  ValidateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration
);

  router.patch(
    '/:id',
    ValidateRequest(
      SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationController.updateSemesterRegistration,
  );

//   router.get(
//     '/:id',
//     SemesterRegistrationController.getSingleSemesterRegistration,
//   );

//   router.delete(
//     '/:id',
//     SemesterRegistrationController.deleteSemesterRegistration,
//   );

router.get("/", SemesterRegistrationController.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;
