import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";



const CreateAcademicDepartmentIntoDB = async(payload : TAcademicDepartment) => {


    const res = await AcademicDepartmentModel.create(payload);
    return res;
}

const GetAcademicDepartmentFromDB = async() => {
    const res = await AcademicDepartmentModel.find().populate('academicFaculty');
    return res;
}



export const AcademicDepartmentServices = {
    CreateAcademicDepartmentIntoDB,
    GetAcademicDepartmentFromDB
}