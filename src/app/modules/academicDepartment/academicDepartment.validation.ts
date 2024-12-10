import { z } from "zod";


const CreateAcademicDepartmentValidationSchema = z.object({

    body : z.object({
        name : z.string({
            invalid_type_error: "Academic Department must be a string"
        }),
        academicFaculty: z.string({
            invalid_type_error: "Academic Faculty must be a string",
            required_error: "Faculty is required"
        })
    })
})

export const AcademicDepartmentValidations = {
    CreateAcademicDepartmentValidationSchema
};
