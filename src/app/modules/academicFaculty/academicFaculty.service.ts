import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";


const CreateAcademicFacultyIntoDB = async(payload : TAcademicFaculty) => {


    const res = await AcademicFacultyModel.create(payload);
    return res;
}



export const AcademicFacultyServices = {
    CreateAcademicFacultyIntoDB
}