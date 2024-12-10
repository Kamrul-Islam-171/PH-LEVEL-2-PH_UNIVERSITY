
import express from "express";
import { StudentControllers } from "./student.controller";
import ValidateRequest from "../../middlewares/validateRequests";
import studentValidationSchema from "./student.validation";
import { studentZodValidations } from "./student.zod.validation";

const router = express.Router();

//we will call controller func
// router.post('/create-student', StudentControllers.createStudent);

router.get('/:studentID', StudentControllers.GetSingleSdudents);
router.delete('/:studentID', StudentControllers.DeleteSingleSdudents);
// router.get('/get-all-stu', StudentControllers.GetSdudents);
router.get('/', StudentControllers.getAllStudents);

router.patch('/:studentID',ValidateRequest(studentZodValidations.UpdateStudentZodValidationSchema), StudentControllers.UpdateStudent)


export const StudentRoutes = router;