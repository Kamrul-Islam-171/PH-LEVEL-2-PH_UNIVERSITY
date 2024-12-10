
import { model, Schema } from "mongoose";
import { TAcademicSemester, TAcademicSemesterCode, TAcademicSemesterName, TMonth } from "./academicSemester.interface";
import { AcademicSemesterConstants } from "./academicSemester.constant";

// const AcademicSemesterName : TAcademicSemesterName[] = ["Autumn", "Summer", "Fall"];
// const AcademicSemesterCode : TAcademicSemesterCode[] = ["01", "02", "03"];

// const months: TMonth[] = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

const AcademicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    enum: {
      values: AcademicSemesterConstants.AcademicSemesterName,
      message: "{VALUE} is not valid",
    },
    required: true,
  },
  code: {
    type: String,
    enum: {
      values: AcademicSemesterConstants.AcademicSemesterCode,
      message: "{VALUE} is not valid",
    },
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  startMonth: {
    type: String,
    enum: {
      values: AcademicSemesterConstants.months,
      message: "{VALUE} is not valid",
    },
    required: true,
  },
  endMonth: {
    type: String,
    enum: {
      values: AcademicSemesterConstants.months,
      message: "{VALUE} is not valid",
    },
    required: true,
  },
});


// akhon same year e Autumn name e 2 ta semester to create kora jabe na
// ei validation ta service eo kora jay. but amra mongoose er pre hook use korbo
// means data save er age validation korbo
// ei hook e arrow function use kora jabe na . karon arrow function e this kaj kore na
// jehetu sob application er jonno common tai model e likchi

AcademicSemesterSchema.pre('save', async function(next) {

  const isSemesterExists = await academicSemesterModel.findOne({
    year: this.year,
    name: this.name
  })

  if(isSemesterExists) {
    throw new Error('Semester is already exists!')
  }
  next();

})


export const academicSemesterModel = model<TAcademicSemester>("academicSemesterModel", AcademicSemesterSchema);