
import express from "express";
import { StudentControllers } from "./student.controller";

const router = express.Router();

//we will call controller func
router.post('/create-student', StudentControllers.createStudent);

router.get('/', StudentControllers.GetSdudents);
router.get('/:studentID', StudentControllers.GetSingleSdudents);
router.delete('/:studentID', StudentControllers.DeleteSingleSdudents);


export const StudentRoutes = router;