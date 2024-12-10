import { TAcademicSemesterCode, TAcademicSemesterCodeMaper, TAcademicSemesterName, TMonth } from "./academicSemester.interface";


const AcademicSemesterName : TAcademicSemesterName[] = ["Autumn", "Summer", "Fall"];
const AcademicSemesterCode : TAcademicSemesterCode[] = ["01", "02", "03"];

const months: TMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const AcademicSemesterCodeMaper : TAcademicSemesterCodeMaper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
}

export const AcademicSemesterConstants = {
    months,
    AcademicSemesterCode,
    AcademicSemesterName
}