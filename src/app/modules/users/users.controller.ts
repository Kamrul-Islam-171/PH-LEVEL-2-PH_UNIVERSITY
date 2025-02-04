import { Request, RequestHandler, Response } from "express";
import { UserService } from "./users.service";
// import userValidationSchema from './users.validation';
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";


const createStudent : RequestHandler = async (req, res) => {
    try {

      // console.log(req.file);
      // console.log(JSON.parse(req.body.data))
      // console.log((req.body))
  
      
      
      
      const {password ,student: StudentData } = req.body;
      
      // const zodValidDAta = userValidationSchema.parse(StudentData)
      
      // const result = await UserService.CreateStudentIntoDB(zodValidDAta);
      

      const result = await UserService.CreateStudentIntoDB(req.file, password, StudentData);
      // console.log("res = ",result)
      
      
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
        message: "Something went wrong from student controller",
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

  const getMe = catchAsync(async (req, res) => {
    // const token = req.headers.authorization;
  
    // if (!token) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'Token not found !');
    // }
  
    const { id, role } = req.user;
  
    const result = await UserService.getMe(id, role);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User is retrieved succesfully',
      data: result,
    });
  });

  const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
  
    const result = await UserService.changeStatus(id, req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Status is updated succesfully',
      data: result,
    });
  });

export const UserController = {
    createStudent,
    createFaculty,
    getMe,
    changeStatus
}
  