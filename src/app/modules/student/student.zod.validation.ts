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
    .refine((value) => /^[A-Za-z]+$/.test(value), { message: "{VALUE} is not valid" }),
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
const studentZodValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "password is required"),
  name: userSchema,
  gender: z
    .enum(["Male", "Female"], { invalid_type_error: "{VALUE} is not valid" }),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gurdian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: z.string().min(1, "Profile image is required"),
  isDeleted : z.boolean(),
  isActive: z
    .enum(["active", "inActive"])
    .optional()
    .default("active"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("{VALUE} is not a valid email type"),
});

export default studentZodValidationSchema;