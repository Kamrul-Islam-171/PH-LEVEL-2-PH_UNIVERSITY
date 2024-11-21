import { Student } from "./student.interface";
import { StudentModel } from "./student.model";

const CreateStudentIntoDB = async(student: Student) => {

    const res = await StudentModel.create(student);
    return res;
}

const GetStudentFromDB = async() => {
    const res = await StudentModel.find();
    return res;
}

const GetSingleStudentFromDB = async(id: string) => {
    // const res = await StudentModel.findOne({id});
    const res = await StudentModel.aggregate([
        {
            $match: {id: id}
        }
    ])
    return res;
}
const DeleteStudentFromDB = async(id: string) => {
    const res = await StudentModel.updateOne({id}, {isDeleted : true});
    return res;
}

export const StudentServices = {
    CreateStudentIntoDB,
    GetStudentFromDB,
    GetSingleStudentFromDB,
    DeleteStudentFromDB
}