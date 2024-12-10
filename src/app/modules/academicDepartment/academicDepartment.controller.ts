

import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";


import status from "http-status";
import { AcademicDepartmentServices } from "./academicDepartment.service";


const CreateAcademicDepartment  = catchAsync(async (req, res) => {
  
   

    const result = await AcademicDepartmentServices.CreateAcademicDepartmentIntoDB(req.body)
    

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic Department is created',
      data : result
    })

   
  

  
});


const GetAllAcademicDepartment  = catchAsync(async (req, res) => {
  
  
  const result = await AcademicDepartmentServices.GetAcademicDepartmentFromDB();
  

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Department is retrive successfully',
    data : result
  })


});




export const AcademicDepartmentController = {
    CreateAcademicDepartment,
    GetAllAcademicDepartment
};
