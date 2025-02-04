import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

import httpStatus from "http-status";
const createEnrolledCourse = catchAsync(async (req, res) => {
 
    const userId = req.user.id;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
      userId,
      req.body,
    );
 
    // console.log(req.user);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is enrolled succesfully',
      data: result,
    });
  });

  const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.id;
    console.log(facultyId)
    
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
      facultyId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Marks is updated succesfully',
      data: result,
    });
  });
  
  export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
  };