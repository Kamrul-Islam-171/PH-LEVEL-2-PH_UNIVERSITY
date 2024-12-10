import { z } from "zod";
import { AcademicSemesterConstants } from "./academicSemester.constant";

const CreateAcademicSemesterValidationSchema = z.object({

    body : z.object({
        name : z.enum([...AcademicSemesterConstants.AcademicSemesterName] as [string, ...string[]]),
        year : z.string(),
        code : z.enum([...AcademicSemesterConstants.AcademicSemesterCode] as [string, ...string[]]),
        startMonth : z.enum([...AcademicSemesterConstants.months] as [string, ...string[]]),
        // admissionSemester: z.string(),
        endMonth : z.enum([...AcademicSemesterConstants.months] as [string, ...string[]])
    })
})

export const AcademicSemesterValidations = {
  CreateAcademicSemesterValidationSchema
};
