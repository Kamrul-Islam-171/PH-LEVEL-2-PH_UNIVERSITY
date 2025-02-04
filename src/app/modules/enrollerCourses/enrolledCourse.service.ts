import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import httpStatus from "http-status";
import EnrolledCourse from "./enrolledCourse.model";
import { StudentModel } from "../student/student.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { CourseModel } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";

const createEnrolledCourseIntoDB = async (
  id: string,
  payload: TEnrolledCourse
) => {
  /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled. 2 bar enroll korte parbe na
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  // user er checking already auth e hoia asche. tai r ei khane user exist, blocked check kora lagbe na

  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Couse is not found!");
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, "room i full!");
  }

  const course = await CourseModel.findById(isOfferedCourseExists.course);

  const student = await StudentModel.findOne({ id }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "student is not found!");
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, "Student is already enrolled!");
  }

  //check total credit exceeds maxCredit
  const semesteReg = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration
  ).select("maxCredit");

  // if(semesteReg) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Semester reg is not found');
  // }

  // total enrolled credits + new enrolled course credit > maxCredit then enroll korte dibo na
  const enrollerCouses = await EnrolledCourse.aggregate([
    {
      //  akta student oi semesterReg e kon kon course korche tar list ber korbo
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      // course to onno collection e tai look up use korchi. (ref er time e use korte hoy)
      $lookup: {
        from: 'coursemodels', // database e coursemodels name e collection ta save ache
        localField: 'course', // enrolledCouse collection e course name e field
        foreignField: '_id', // coursemodels colection e _id name a ache
        as: 'enrolledCourseData'
      }
    },
    {
      $unwind: '$enrolledCourseData'
    },
    {
      $group: {_id:null, totalEnrolledCredits: {$sum : '$enrolledCourseData.credits'}}
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1
      }
    }
  ]);

  console.log(enrollerCouses);

  const totalCredits = enrollerCouses.length > 0 ? enrollerCouses[0]?.totalEnrolledCredits : 0;
  if(totalCredits && semesteReg?.maxCredit && totalCredits + course?.credits > semesteReg?.maxCredit) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have exceed maximum number of credits")
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // return null;

    const res = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session }
    );

    if (!res) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Failed to enroll in this course!"
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;

    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();
    return res;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {

  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found !',
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }
  const isStudentExists = await StudentModel.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden! !');
  }

  // akhon dynamically update korbo. jehetu object
  const modifiedData: Record<string,unknown> = {
    ...courseMarks
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

   // dynamiclly object data update hobe
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;

  
};


export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
