import { z } from "zod";
import { UserStatus } from "./user.constant";

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .max(20, { message: "Password Can be at most 20 char." })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const Uservalidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
