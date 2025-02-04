import { z } from "zod";

// User schema
const userSchema = z.object({
  firsName: z
    .string()
    .trim()
    .min(1, "vai first name lagbei lagbe") // Equivalent to required
    .max(20, "Max allowed length is 20")
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      (value) => ({ message: `${value} is not capitalized format` })
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "vai last name lagbei lagbe") // Equivalent to required
    .max(20, "Max allowed length is 20")
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: "{VALUE} is not valid",
    }),
});

// Guardian schema
const guardianSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  fatherOccupation: z.string().min(1, "Father's occupation is required"),
});

// Local Guardian schema
const localGuardianSchema = z.object({
  name: z.string().min(1, "Local guardian name is required"),
  address: z.string().min(1, "Local guardian address is required"),
});

// Student schema
const CreatestudentZodValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: userSchema,
      gender: z.enum(["Male", "Female"], {
        invalid_type_error: "{VALUE} is not valid",
      }),
      dateOfBirth: z.string().min(1, "Date of Birth is required"),
      gurdian: guardianSchema,
      localGuardian: localGuardianSchema,
      // profileImg: z.string().min(1, "Profile image is required"),

      email: z
        .string()
        .min(1, "Email is required")
        .email("{VALUE} is not a valid email type"),
    }),
  }),
});




//for update we need to use optional with all of them.
const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "vai first name lagbei lagbe") // Equivalent to required
    .max(20, "Max allowed length is 20")
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      (value) => ({ message: `${value} is not capitalized format` })
    )
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "vai last name lagbei lagbe") // Equivalent to required
    .max(20, "Max allowed length is 20")
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: "{VALUE} is not valid",
    })
    .optional(),
});

// Guardian schema
const updateGuardianSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required").optional(),
  fatherOccupation: z
    .string()
    .min(1, "Father's occupation is required")
    .optional(),
});

// Local Guardian schema
const updateLocalGuardianSchema = z.object({
  name: z.string().min(1, "Local guardian name is required").optional(),
  address: z.string().min(1, "Local guardian address is required").optional(),
});

// Student schema
const UpdateStudentZodValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserSchema.optional(),
      gender: z
        .enum(["Male", "Female"], {
          invalid_type_error: "{VALUE} is not valid",
        })
        .optional(),
      dateOfBirth: z.string().min(1, "Date of Birth is required").optional(),
      gurdian: updateGuardianSchema.optional(),
      localGuardian: updateLocalGuardianSchema.optional(),
      profileImg: z.string().min(1, "Profile image is required").optional(),
      email: z
        .string()
        .min(1, "Email is required")
        .email("{VALUE} is not a valid email type")
        .optional(),
    }),
  }),
});

export const studentZodValidations = {
  CreatestudentZodValidationSchema,
  UpdateStudentZodValidationSchema
};
