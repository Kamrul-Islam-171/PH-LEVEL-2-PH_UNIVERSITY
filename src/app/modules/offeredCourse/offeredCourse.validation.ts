import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const timeSchema = z.string().refine(
  (time) => {
    //startTime > EndTime hoite hobe. ei gula pabo body er moddhe. body:z.obj() niche tai.
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(time);
  },
  {
    message: 'Invalid Time format, expected "HH:MM" in 24  hours format',
  }
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeSchema, // HH: MM   00-23: 00-59
      endTime: timeSchema,
    })
    .refine(
      (body) => {
        //startTime > EndTime hoite hobe. ei gula pabo body er moddhe. body:z.obj() niche tai.
        // time k compare korar jonno date use kobo. same date
        const startTime = new Date(`1970-01-01T${body.startTime}:00`);
        const endTime = new Date(`1970-01-01T${body.endTime}:00`);

        return endTime > startTime;
      },
      {
        message: "Start time should be before End time !",
      }
    ),
  //   .refine(
  //     (body) => {
  //       // startTime : 10:30  => 1970-01-01T10:30
  //       //endTime : 12:30  =>  1970-01-01T12:30

  //       const start = new Date(`1970-01-01T${body.startTime}:00`);
  //       const end = new Date(`1970-01-01T${body.endTime}:00`);

  //       return end > start;
  //     },
  //     {
  //       message: 'Start time should be before End time !  ',
  //     },
  //   ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeSchema, // HH: MM   00-23: 00-59
      endTime: timeSchema,
      // startTime: timeStringSchema, // HH: MM   00-23: 00-59
      // endTime: timeStringSchema,
    })
    .refine(
      (body) => {
       
        const startTime = new Date(`1970-01-01T${body.startTime}:00`);
        const endTime = new Date(`1970-01-01T${body.endTime}:00`);

        return endTime > startTime;
      },
      {
        message: "Start time should be before End time !",
      }
    ),
 
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
