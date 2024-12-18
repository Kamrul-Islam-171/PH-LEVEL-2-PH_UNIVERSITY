
import mongoose, { Schema } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interfact';
import { Days } from './offeredCourse.constant';


const offeredCourseSchema = new mongoose.Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SemesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'academicSemesterModel',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFacultyModel',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicDepartmentModel',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CourseModel',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Faculty',
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: Days,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourse = mongoose.model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);