

import {Router} from "express";
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/users/users.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { CourseRoutes } from "../modules/course/course.router";
import { FacultyRoutes } from "../modules/faculty/faculty.route";

const router = Router();



const moduleroutes = [
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/academic-semesters',
        route: AcademicSemesterRoutes
    },
    {
        path: '/academic-faculty',
        route: AcademicFacultyRoutes
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRoutes
    },
    {
        path: '/courses',
        route: CourseRoutes
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
      },
]

// router.use('/students', StudentRoutes)
// router.use('/users', UserRoutes);

moduleroutes.forEach(route => router.use(route.path, route.route));





export default router;