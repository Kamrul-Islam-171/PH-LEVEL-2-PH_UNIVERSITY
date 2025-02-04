import mongoose from "mongoose";
import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { academicSemesterModel } from "../academicSemester/academicSemester.model";
import { Student } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./users.interface";
import { UserModel } from "./users.model";
import { generateFacultyId, generateStudentId } from "./users.utils";
import AppError from "../../errors/AppError";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const CreateStudentIntoDB = async (
  file: any,
  password: string,
  student: Student
) => {
  // if(await Student.isUserExists(student.id)) {
  //     throw new Error('User Already Exists')
  // }

  // console.log("file from service = ", file)
  // console.log(student)

  //create user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password

  // if(!password) {
  //     user.password = config.default_pass as string
  // }
  // else {
  //     user.password = password;
  // }

  // or we can write it like this
  userData.password = password || (config.default_pass as string);
  userData.role = "student";
  userData.email = student.email;

  //set manually generated id
  // userData.id = '203000113'

  //find academic semester info
  const admissionSemester = await academicSemesterModel.findById(
    student.admissionSemester
  );

  //   console.log(admissionSemester);

  //genereate id dynamically
  // const generateId = (payload: TAcademicSemester) =>{
  //     // do it yourself module 12 video 9
  //     //findone operation chalaite hobe
  // }

  //transaction and rollback use korbo and isolated aread create korbo

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester
    );

    //send image to cloudinary
    const imageName = `${userData.id}${student?.name?.firsName}`;
    const path = file?.path;
    const imgData = await sendImageToCloudinary(path, imageName);
    // console.log(imgData)
    

    //create a user (transaction-1, transaction er moddhe data array hisebe dite hobe)
    const newUser = await UserModel.create([userData], { session }); // amar akta transaction start hoye gelo

    //create a student

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    student.id = newUser[0].id;
    student.user = newUser[0]._id; //reference _id
    student.profileImg = imgData?.secure_url;
    // console.log(student)

    //create a student (transaction - 2)
    const newStudent = await StudentModel.create([student], { session });
    // console.log("i am here", newStudent);
    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    // console.log(error)
    // console.log("i am here to abrot");
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to create new student");
  }
  // console.log("i am here")
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = "faculty";
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // console.log({'userAfterHash':userData});

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;

  let result = null;
  if (role === "student") {
    result = await StudentModel.findOne({ id: userId }).populate("user");
  }
  // if (role === 'admin') {
  //   result = await Admin.findOne({ id: userId }).populate('user');
  // }

  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserService = {
  CreateStudentIntoDB,
  createFacultyIntoDB,
  getMe,
  changeStatus,
};
