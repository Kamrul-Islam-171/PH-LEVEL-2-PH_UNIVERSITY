import { NextFunction, Request, RequestHandler, Response } from "express";

import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

import status from "http-status";

const CreateAcademicSemester  = catchAsync(async (req, res) => {
  
    // const result = await StudentServices.GetStudentFromDB();
    // console.log(req.body);

    const result = await AcademicSemesterServices.CreateAcademicSemesterIntoDB(req.body);
    

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic Semester is created',
      data : result
    })

    // res.status(200).json({
    //     success : true,
    //     message: 'Academic is Created',
    //     data : result
    // })
  

  
});



export const AcademicSemesterController = {
    CreateAcademicSemester
};
