
import express from "express";
import { StudentControllers } from "./student.controller";
import ValidateRequest from "../../middlewares/validateRequests";
import studentValidationSchema from "./student.validation";
import { studentZodValidations } from "./student.zod.validation";
import Auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";

const router = express.Router();

//we will call controller func
// router.post('/create-student', StudentControllers.createStudent);

// admin and faculty sob student er id dekhta parbe. but akjon stu arek jon er ta parbe na
// tai auth er moddhe st dey nai. but na dile nijeo dekhte parbo na. tai arekta route lagbe (/me) name e

router.get('/:studentID', Auth('admin', 'faculty'), StudentControllers.GetSingleSdudents);
router.delete('/:studentID', StudentControllers.DeleteSingleSdudents);
// router.get('/get-all-stu', StudentControllers.GetSdudents);
router.get('/', StudentControllers.getAllStudents);

router.patch('/:studentID',ValidateRequest(studentZodValidations.UpdateStudentZodValidationSchema), StudentControllers.UpdateStudent)


export const StudentRoutes = router;