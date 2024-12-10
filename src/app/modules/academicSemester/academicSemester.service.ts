import { AcademicSemesterCodeMaper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterModel } from "./academicSemester.model";

const CreateAcademicSemesterIntoDB = async(payload : TAcademicSemester) => {

    // Autumn er jonno 01 hobe. na hole error

    //map type use korbo
    // type TAcademicSemesterCodeMaper = {
    //     [key: string] : string
    // }

    // const AcademicSemesterCodeMaper : TAcademicSemesterCodeMaper = {
    //     Autumn: '01',
    //     Summer: '02',
    //     Fall: '03',
    // }

    if(AcademicSemesterCodeMaper[payload.name] !== payload.code) {
        throw new Error("Invalid Semester code")
    }

    const res = await academicSemesterModel.create(payload);
    return res;
}



export const AcademicSemesterServices = {
    CreateAcademicSemesterIntoDB
}