import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error";

const HandleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1], // last index er value ta nibo
      message: issue?.message,
    };
  });

  return {
    statusCode,
    // message: 'Zod validation Error!!',
    message: "Validation Error!!",
    errorSources,
  };
};

export default HandleZodError;
