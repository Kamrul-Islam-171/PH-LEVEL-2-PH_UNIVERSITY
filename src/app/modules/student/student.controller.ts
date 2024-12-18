import { NextFunction, Request, RequestHandler, Response } from "express";
import { StudentServices } from "./student.service";

import { z } from "zod";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";
// import studentZodValidationSchema from "./student.zod.validation";

// import Joi from 'joi';
// import studentValidationSchema from "./student.validation";

// const createStudent = async (req: Request, res: Response) => {
//   try {

    
    
    
//     const { student: StudentData } = req.body;
    
//     const zodValidDAta = studentZodValidationSchema.parse(StudentData)
//     // const {error , value} = studentValidationSchema.validate(StudentData);
//     // console.log({"my err = ":error}, {"my-val = ":value});
//     const result = await StudentServices.CreateStudentIntoDB(zodValidDAta);

//     // if(error) {
//     //   res.status(500).json({
//     //     success: false,
//     //     message: "Something went wrong from user",
//     //     error: error.details,
//     //   });
//     // }


//     //will call service func to send this data
//     //

//     res.status(200).json({
//       success: true,
//       message: "Student is created successfully",
//       data: result,
//     });

//     //send response
//   } catch (error) {
//     // console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error,
//     });
//   }
// };

/*
যেকোনো প্রোগ্রাম বা এপ্লিকেশনে Error Handling একটি গুরুত্বপূর্ণ বিষয়। তবে যখন টপিকটা Express এপ্লিশেনের তখন এরর হ্যান্ডলিং আমাদের কাছে অনেক গুরুত্বপূর্ণ। আমরা জানি express সিনক্রোনাস এরর নিজের থেকে হ্যান্ডেল করতে পারলেও এসিনক্রোনাস এরর হ্যান্ডেল করতে পারে না। তাই এসিনক্রোনাস কোডে এরর হান্ডেল করার জন্য আমরা সাধারণত try-catch/.then.catch ব্লক ইউজ করে থাকি।
আমাদের কে প্রতিটা এসিনক্রনাস টাস্ক হান্ডেল করার জন্য বার বার try-catch/.then.catch ব্লক ডিফাইন করতে হয়। কিন্ত এখানে একটা প্রবলেম আছে, আমরা তো ডাইন্যামিক ডেভেলপার, তাই না? আমাদের সাথে কি কোড রিপিটেশন মানায়?
না, আমাদের সাথে কোড রিপিটেশন মানায় না। আমাদের কোডটিকে যতটা সম্ভব সংক্ষিপ্ত, সহজ এবং পুনঃব্যবহারযোগ্য রাখা উচিত। তাহলে কি করতে হবে?
ডাইন্যামিক সলুশন বের করতে হবে! আর এখানেই catchAsync ফাংশনটি এই সমস্যাটি সমাধান করতে সাহায্য করে। এটি একটি Higher-Order ফাংশন যা অ্যাসিনক্রোনাস ফাংশনের এরর হান্ডেল করার জন্য ব্যাবহার করা হয়। এটি একটি ফাংশন গ্রহণ করে এবং এটিকে একটি try-catch ব্লকে মোড়ক করে। যদি ফাংশনটির মধ্যে কোনও এরর হয় তবে এররটি next ফাংশনের মাধ্যমে এক্সপ্রেসের এরর হান্ডেল মিডওয়ারে পাস করে দেয়।
catchAsync ফাংশনটি ব্যবহার করার ফলে, আমাদের প্রতিটি অ্যাসিনক্রোনাস টাস্কের জন্য try-catch/ .then.catch ব্লক ডিফাইন করতে হবে না। এটি কোডটিকে আরও সংক্ষিপ্ত এবং রিইউজেবুল করে তোলে।
উদাহরণস্বরূপ, আমরা নিম্নলিখিত কোডটি ব্যবহার করে একটি অ্যাসিনক্রোনাস টাস্ক পরিচালনা করতে পারি:

import { NextFunction, Request, RequestHandler, Response } from 'express';
const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const userData = await fetch('<https://example.com/api/users>')
  .then((response) => response.json())
  .catch((error) => console.log(error));

  res.send(userData);
};

এই কোডটিকে আমরা এভাবে সংক্ষিপ্ত করতে পারি:

const getUserData = catchAsync(async (req, res) => {
  const userData = await fetch('<https://example.com/api/users>')
  res.send(userData);
});

যেখানে catchAsync ফাংশনটিঃ

import { NextFunction, Request, RequestHandler, Response } from 'express';
const catchAsync = (fn: RequestHandler) => { 
	return (req: Request, res: Response, next: NextFunction) => { 
		Promise.resolve(fn(req, res, next)).catch((err) => next(err)); 
	};
};
export default catchAsync;

catchAsync ফাংশনটি একটি প্যারামিটার গ্রহণ করে, যা হলো একটি অ্যাসিনক্রোনাস রিকোয়েস্ট হ্যান্ডলার ফাংশন (fn: RequestHandler). এটি একটি নতুন ফাংশন রিটার্ন করে, যা একটি Promise হিসেবে একটি অ্যাসিনক্রোনাস ফাংশনকে আবদ্ধ করে।
এটি কোডটি দুই অংশে ভাগ করা যেতে পারে:
প্রথম অংশ: এটি fn(req, res, next) ফাংশনটিকে একটি Promise এ রূপান্তর করে। এটি Promise.resolve() পদ্ধতি ব্যবহার করে করা হয়। এটি নিশ্চিত করে যে ফাংশনটি সর্বদা একটি প্রমিস হিসেবে এনক্যাপসুলেট হয়।
দ্বিতীয় অংশ: এটি fn(req, res, next) ফাংশনটি থেকে ফেরত দেওয়া Promise এর জন্য একটি catch ব্লকটি সংযুক্ত করে। এই catch ব্লকটি ত্রুটিটি ধরে এবং next(err) কল করে।
অর্থাৎঃ

import { NextFunction, Request, RequestHandler, Response } from 'express';

// catchAsync ফাংশনটি একটি অ্যাসিনক্রোনাস রিকোয়েস্ট হ্যান্ডল করে
const catchAsync = (fn: RequestHandler) => {
// এটি একটি নতুন ফাংশন রিটার্ন করে, যা একটি Promise হিসেবে একটি অ্যাসিনক্রোনাস ফাংশনকে আবদ্ধ করে
	return (req: Request, res: Response, next: NextFunction) => {
		// Promise.resolve() পদ্ধতিটি ফাংশনটির রিটার্ন মানকে Promise হিসেবে এনক্যাপসুলেট করে
		// এটি নিশ্চিত করে যে ফাংশনটি সর্বদা একটি প্রমিস হিসেবে এনক্যাপসুলেট হচ্ছে
		Promise.resolve(fn(req, res, next))
		.catch((err) => next(err)); 
		// এটি ত্রুটি হ্যান্ডল করতে next() কল করে, 
		// যা এরর টিকে globalErrorHandler এর কাছে পাস করে দেয়।
	};
};

export default catchAsync;

তাই, আমাদের প্রতিটি অ্যাসিনক্রোনাস টাস্কের জন্য try-catch/.then.catch ব্লক ডিফাইন করার পরিবর্তে, আমরা catchAsync ফাংশনটি ব্যবহার করতে পারি। এটি আমাদের কোডটিকে আরও সংক্ষিপ্ত, সহজ এবং পুনঃব্যবহারযোগ্য করে তুলবে।

*/


//higher order func


const GetSdudents  = catchAsync(async (req, res) => {
  
    const result = await StudentServices.GetStudentFromDB();
   

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student data is retrive',
      data : result
    })
  
    
    // next(error); //global error handler . app.ts e global handeler ta use korbo
  
});

const getAllStudents = catchAsync(async(req : Request, res : Response) => {

    // console.log('this is from token = ',req.user)

    console.log({cookie : req.cookies})
 
    const result = await StudentServices.getAllStudentsFromDB(req.query);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student data is retrive',
      data : result
    })
  


})

const GetSingleSdudents = catchAsync(async (req, res) => {
  
    const { studentID } = req.params;
    // console.log(studentID)

    const result = await StudentServices.GetSingleStudentFromDB(studentID);
    res.status(200).json({
      success: true,
      message: "Student data is retrive",
      data: result,
    });
  
});

const DeleteSingleSdudents : RequestHandler = async (req, res, next) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.DeleteStudentFromDB(studentID);
    res.status(200).json({
      success: true,
      message: "Student data is deleted",
      data: result,
    });
  } catch (error) {
    // console.log(error);
    next(error); //global error handler

  }
};

const UpdateStudent = catchAsync(async (req, res) => {
  
  const { studentID } = req.params;
  
  const {student} = req.body;
 
  const result = await StudentServices.UpdateStudentIntoDB(studentID, student);
  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: result,
  });

});

export const StudentControllers = {
  // createStudent,
  GetSdudents,
  GetSingleSdudents,
  DeleteSingleSdudents,
  getAllStudents,
  UpdateStudent
};
