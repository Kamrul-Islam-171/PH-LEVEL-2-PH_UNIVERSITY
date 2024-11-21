import { Request, Response } from "express";
import { StudentServices } from "./student.service";

import { z } from "zod";
import studentZodValidationSchema from "./student.zod.validation";

// import Joi from 'joi';
// import studentValidationSchema from "./student.validation";

const createStudent = async (req: Request, res: Response) => {
  try {

    
    
    
    const { student: StudentData } = req.body;
    
    const zodValidDAta = studentZodValidationSchema.parse(StudentData)
    // const {error , value} = studentValidationSchema.validate(StudentData);
    // console.log({"my err = ":error}, {"my-val = ":value});
    const result = await StudentServices.CreateStudentIntoDB(zodValidDAta);

    // if(error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "Something went wrong from user",
    //     error: error.details,
    //   });
    // }


    //will call service func to send this data
    //

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

const GetSdudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.GetStudentFromDB();
    res.status(200).json({
      success: true,
      message: "Students data is retrive",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const GetSingleSdudents = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.GetSingleStudentFromDB(studentID);
    res.status(200).json({
      success: true,
      message: "Student data is retrive",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const DeleteSingleSdudents = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.DeleteStudentFromDB(studentID);
    res.status(200).json({
      success: true,
      message: "Student data is deleted",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  GetSdudents,
  GetSingleSdudents,
  DeleteSingleSdudents
};
