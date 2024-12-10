import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { UserModel } from "./users.model";

const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: "student",
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

    // console.log(lastStudent)

  //203001   0001
  return lastStudent?.id ? lastStudent.id: undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  //0001  => 1
  // console.log(payload)
  let currentId = (0).toString();

  const lastStudentId = await findLastStudentId();
  const lastStudentYear = lastStudentId?.substring(0,4); 
  const lastStudentSemesterCode = lastStudentId?.substring(4,6); 
  const currentYear = payload.year;
  const currentSemesterCode = payload.code;

  if(lastStudentId && lastStudentSemesterCode === currentSemesterCode && lastStudentYear === currentYear) {
    currentId = lastStudentId.substring(6);
  }
  

  // console.log(currentId)

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");


  
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  // console.log(incrementId)
  

  return incrementId;
};



// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};