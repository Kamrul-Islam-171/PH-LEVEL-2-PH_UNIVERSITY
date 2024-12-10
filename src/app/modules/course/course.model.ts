import { model, Schema } from "mongoose";
import { TCourse, TCoursefaculty, TPreRequisiteCourses } from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "CourseModel",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseModel = model<TCourse>("CourseModel", courseSchema);


const courseFacultySchema = new Schema<TCoursefaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'CourseModel',
    unique: true
  },
  faculties: [{
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    
  }]
})

export const CourseFaculty = model<TCoursefaculty>(
  'CourseFaculty',
  courseFacultySchema,
);