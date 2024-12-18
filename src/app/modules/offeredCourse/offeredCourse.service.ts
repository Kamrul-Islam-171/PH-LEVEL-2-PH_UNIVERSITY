import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { CourseModel } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interfact";
import { OfferedCourse } from "./offeredCourse.model";
import httpStatus from "http-status";

import hasTimeConflict from "./offeredCourse.utils";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  //check if the semester registration id is exists!
  //check if the semester registration id is exists!
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration not found !"
    );
  }

  const academicSemester = isSemesterRegistrationExits.academicSemester;

  const isAcademicFacultyExits =
    await AcademicFacultyModel.findById(academicFaculty);

  if (!isAcademicFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty not found !");
  }

  const isAcademicDepartmentExits =
    await AcademicDepartmentModel.findById(academicDepartment);

  if (!isAcademicDepartmentExits) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found !");
  }

  const isCourseExits = await CourseModel.findById(course);

  if (!isCourseExits) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found !");
  }

  const isFacultyExits = await Faculty.findById(faculty);

  if (!isFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found !");
  }

  // now check if the department is belongs to the faculty.
  // naile to data inconcestency hobe
  // tar mane dekhte hobe j oi department er moddhe oi fachulty ache ki na
  const isDepartmentBelongsToFaculty = await AcademicDepartmentModel.findOne({
    // _id:new mongoose.Types.ObjectId(academicDepartment),
    _id: academicDepartment,
    academicFaculty,
  });
  // console.log(academicDepartment, academicFaculty)

  // console.log(isDepartmentBelongsToFaculty)

  if (!isDepartmentBelongsToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExits.name} is not belongs to ${isAcademicFacultyExits.name}`
    );
  }

  //check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  // console.log(isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection)

  if (
    isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection?.section ===
    section
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Offered Course with same section is already exists !"
    );
  }

  // now akjon to same time e multiple jaygay class nite parbe na.
  // time confict handle korte hobe
  // get the schedules for the faculties(teacher)
  // ei semester er moddhe amr kon kon faculties er kon kon time ache sob lagbe. for a specific faculty(teacher)
  // means ei semester e akjon faculty(teacher ) er kon kon offered course gula ache sob gula nia aso.
  // er jonno faculites and semesterReg dia search dite hobe

  const assighSchedules = await OfferedCourse.find(
    { semesterRegistration, faculty, days: { $in: days } },
    { days: 1, startTime: 1, endTime: 1, _id: 0 }
  );

  console.log(assighSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assighSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This faculty is not available at that time. choose another time!"
    );
  }
  const res = await OfferedCourse.create({ ...payload, academicSemester });
  return res;
  // return null;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
  // payload: Pick<TOfferedCourse>,
) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */
  const {faculty, days, startTime, endTime} = payload

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if(!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found !')
  }

  const isFacultyExists = await Faculty.findById(payload.faculty);
  if(!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found !')
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegStatus = await SemesterRegistration.findById(semesterRegistration);
  if(semesterRegStatus?.status !== 'UPCOMING') {
    throw new AppError(httpStatus.BAD_REQUEST, 'You can not update this offered course as it is UPCOMING !')
  }

  const assighSchedules = await OfferedCourse.find(
    { semesterRegistration, faculty, days: { $in: days } },
    { days: 1, startTime: 1, endTime: 1, _id: 0 }
  );

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assighSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This faculty is not available at that time. choose another time!"
    );
  }

  
  const res = await OfferedCourse.findByIdAndUpdate(id, payload, {new: true});
  return res;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  // getAllOfferedCoursesFromDB,
  // getSingleOfferedCourseFromDB,
  // deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
