import { z } from "zod";

const userValidationSchema = z.object({
 
  password: z
    .string({
        invalid_type_error: 'Password must be string'
    })
    .max(20, {message : "Password Can be at most 20 char."})
    .optional(),
  
  
  
});

export default userValidationSchema;