import { Request, RequestHandler, Response } from "express";
import { UserService } from "./users.service";
import userValidationSchema from './users.validation';
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";


const createStudent : RequestHandler = async (req, res) => {
    try {
  
      
      
      
      const {password ,student: StudentData } = req.body;
      
      // const zodValidDAta = userValidationSchema.parse(StudentData)
      
      // const result = await UserService.CreateStudentIntoDB(zodValidDAta);

      const result = await UserService.CreateStudentIntoDB(password, StudentData);
      
      
      res.status(200).json({
        success: true,
        message: "Student is created successfully",
        data: result,
      });
  
      //send response
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error,
      });
    }
  };

  const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;
  
    const result = await UserService.createFacultyIntoDB(password, facultyData);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is created succesfully',
      data: result,
    });
  });


export const UserController = {
    createStudent,
    createFaculty
}
  