import { z } from "zod";


const CreateAcademicFacultyValidationSchema = z.object({

    body : z.object({
        name : z.string()
    })
})

export const AcademicFacultyValidations = {
    CreateAcademicFacultyValidationSchema
};
