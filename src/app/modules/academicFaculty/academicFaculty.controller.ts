

import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";


import status from "http-status";
import { AcademicFacultyServices } from "./academicFaculty.service";

const CreateAcademicFaculty  = catchAsync(async (req, res) => {
  
   

    const result = await AcademicFacultyServices.CreateAcademicFacultyIntoDB(req.body)
    

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic Faculty is created',
      data : result
    })

   
  

  
});



export const AcademicFacultyController = {
    CreateAcademicFaculty
};
