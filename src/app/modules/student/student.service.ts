import mongoose from "mongoose";
import { Student } from "./student.interface";
import { StudentModel } from "./student.model";
import AppError from "../../errors/AppError";
import { UserModel } from "../users/users.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableField } from "./student.constant";

//service  = logic develop korbe

const GetStudentFromDB = async () => {
  // console.log('yes')

  // academic department abr faculty k ref kore (par, child)
  // const res = await StudentModel.find().populate('admissionSemester').populate({
  //     path: 'academicDepartment',
  //     populate: {
  //         path: 'academicFaculty',
  //     }
  // });
  const res = await StudentModel.find();
  return res;
};

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // amra pagination, sorting j method e korlam tar name = "method chaning"

  // console.log('queryfrom student service = ',query);

  // const queryObject = {...query};

  // {email : {$regex : query.searchTearm, $optional : i}}
  // {PresentAddress : {$regex : query.searchTearm, $optional : i}}
  // {'name.firstname' : {$regex : query.searchTearm, $optional : i}}

  // let searchTearm = '';
  // if(query?.searchTearm) {
  //   searchTearm = query.searchTearm as string;
  // }

  // const studentSearchableField = ['email', 'name.firstName'];

  //filtering
  // const excluedes = ['searchTearm', 'sort', 'limit', 'page', 'fields'];
  // excluedes.forEach(el => delete queryObject[el])

  // console.log(query, queryObject)

  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableField.map((field) => ({
  //     [field] : {$regex: searchTearm, $options: 'i'}
  //   }))
  // });

  // const filerQuery = searchQuery.find(queryObject);

  // let sort = '-createdAt'
  // if(query?.sort) {
  //   sort = query.sort as string;
  // }

  // const pageQuery = filerQuery.sort(sort)

  // let limit = 1;
  // let page = 1;
  // let skip = 0;
  // if(query.limit) {
  //   limit = query.limit as number;

  // }
  // if(query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit
  // }

  // const limitQuery = pageQuery.skip(skip)

  //field limiting
  // let fields = '-__v';
  // if(query.fields) {
  //   // fields = name, email k
  //   // fileds = name email ei vabe banate hobe

  //   fields = (query.fields as string).split(',').join(' ');
  // }
  // console.log(fields)

  // const filedQuery = limitQuery.limit(limit);

  // ami chai j email or name.fistName er j kono aktay query thaklei show korbe. tai $or use korbo
  // const res = await filedQuery.select(fields);
  // return res;

  // const studentQuery = new QueryBuilder(StudentModel.find(), query)
  //   .search(studentSearchableField)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .fieldsLimiting();

  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate("user")
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableField)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const result = await studentQuery.modelQuery;

  const meta = await studentQuery.countTotal(); // meta mane koyta page ache, koyta document ache ei gula
  return {
    meta, 
    result
  };
};

const GetSingleStudentFromDB = async (id: string) => {
  // const res = await StudentModel.findOne({id});
  // console.log("id = ", id)
  // const res = await StudentModel.aggregate([
  //     {
  //         $match: {_id: new mongoose.Types.ObjectId(id)}
  //     }
  // ])
  // console.log(res)

  const res = await StudentModel.findById({
    _id: new mongoose.Types.ObjectId(id),
  })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  console.log(res);
  return res;
};
const DeleteStudentFromDB = async (id: string) => {
  // detete er jonno user and student 2 ta database e delet kor lagbe. tai transaction use hobe

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const DeleteStudent = await StudentModel.updateOne(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!DeleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Student");
    }

    const userDelete = await UserModel.updateOne(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!userDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete User");
    }

    await session.commitTransaction();
    await session.endSession();

    return DeleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to Delete student");
  }
};

const UpdateStudentIntoDB = async (id: string, payload: Partial<Student>) => {
  //non premetive data type gula seperate kore fellam (object)
  const { name, gurdian, localGuardian, ...remainingStudentInfo } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentInfo,
  };

  /*
  guardian : {
    fatherOcupation : Teacher
  }

  data k ei vabe transform korte hobe

  guardian.fatherOcupation : Teacher 
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (gurdian && Object.keys(gurdian).length) {
    for (const [key, value] of Object.entries(gurdian)) {
      modifiedUpdatedData[`gurdian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const res = await StudentModel.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
  });
  return res;
};

export const StudentServices = {
  // CreateStudentIntoDB,
  GetStudentFromDB,
  GetSingleStudentFromDB,
  DeleteStudentFromDB,
  getAllStudentsFromDB,
  UpdateStudentIntoDB,
};
