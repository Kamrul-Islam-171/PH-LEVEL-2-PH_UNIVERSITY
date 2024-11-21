import Joi from "joi";


const userSchema = Joi.object({
    firsName: Joi.string()
      .trim()
      .required()
      .max(20)
      .pattern(/^[A-Z][a-z]*$/, "capitalized format")
      .messages({
        "string.empty": "vai first name lagbei lagbe",
        "string.max": "Max allowed length is 20",
        "string.pattern.base": "{#value} is not capitalized format",
      }),
    lastName: Joi.string()
      .trim()
      .required()
      .max(20)
      .pattern(/^[a-zA-Z]+$/, "alpha")
      .messages({
        "string.empty": "vai last name lagbei lagbe",
        "string.max": "Max allowed length is 20",
        "string.pattern.base": "{#value} is not valid",
      }),
  });
  
  // Guardian Schema
  const guardianSchema = Joi.object({
    fatherName: Joi.string().required().messages({
      "string.empty": "Father's name is required",
    }),
    fatherOccupation: Joi.string().required().messages({
      "string.empty": "Father's occupation is required",
    }),
  });
  
  // Local Guardian Schema
  const localGuardianSchema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Local guardian's name is required",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Local guardian's address is required",
    }),
  });
  
  // Student Schema
  const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
      "string.empty": "Student ID is required",
    }),
    name: userSchema.required(),
    gender: Joi.string()
      .valid("Male", "Female")
      .required()
      .messages({
        "any.only": "{#value} is not valid",
      }),
    dateOfBirth: Joi.string().required().messages({
      "string.empty": "Date of birth is required",
    }),
    gurdian: guardianSchema.required(),
    localGuardian: localGuardianSchema.required(),
    profileImg: Joi.string().required().messages({
      "string.empty": "Profile image is required",
    }),
    isActive: Joi.string()
      .valid("active", "inActive")
      .default("active")
      .messages({
        "any.only": "{#value} is not valid",
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "{#value} is not a valid email type",
      }),
  });


  export default studentValidationSchema