import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchAbleFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { CourseFaculty, CourseModel } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
  const res = await CourseModel.create(payload);
  return res;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(CourseSearchAbleFields)
    .sort()
    .filter()
    .paginate()
    .fieldsLimiting();
  const res = await courseQuery.modelQuery;
  return res;
};
const getSingleCourseFromDB = async (id: string) => {
  const res = await CourseModel.findById(id);
  return res;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  // first e basic/normal j field (id, name) gual jaygay rakhbo
  // then special field gula(like object, arry gula alada korbo)
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //step 1 : basic course info update
    const updateBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session }
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
    }

    //check if there is any pre requisite course to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields. mane kon couse gula upadate er time e delete korte chai
      const deletePreRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      // .map dia just course field k nichi
      // console.log(deletePreRequisite);

      //akhon amar filter kora id gula bad dibo mongodb theke
      const deletePreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePreRequisite } },
          },
        },
        { new: true, runValidators: true, session }
      );

      if (!deletePreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }

      //akhon j course new add korte chai tader filter korbo
      const newPreRequisite = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted
      );

      // $addToSet = insert korbe but duplicate korbe na
      const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisite } },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }

      await session.commitTransaction();
      await session.endSession();
      const res = await CourseModel.findById(id).populate(
        "preRequisiteCourses.course"
      );
      return res;
    }
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
  }
};

const assignFacultyWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>
) => {
  const res = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true
    }
  );

  return res;
};


const removeFacultyWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>
) => {
  const res = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      
      $pull: { faculties: { $in: payload } },
    },
    {
      
      new: true
    }
  );

  return res;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultyWithCourseIntoDB,
  removeFacultyWithCourseIntoDB
};
