import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { TerrorSourse } from "../interface/error";
import config from "../config";
import HandleZodError from "../errors/HandleZodError";
import HandleMongooseError from "../errors/HandleMongooseError";
import HandleCastError from "../errors/HandleCastError";
import HandleDuplicateError from "../errors/HandleDuplicateError";
import AppError from "../errors/AppError";

let globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
   
  //setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

 

  //default values
  let errorSources : TerrorSourse = [{
    path: '',
    message : 'Something went wrong'
  }]


 

  //checking if it is zod error
  //checking err ta zodError er sub class ki na. tai instaceof use kora hoy
  if(err instanceof ZodError) {
    const simplifiedError = HandleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
    
    // message = "zod error hoiche"
  }
  else if(err?.name === 'ValidationError') {
    //checking if it is mongoose validation error
    // if( err instance of mongoose.error.validationError) ei vabe dileo hobe

    const simplifiedError = HandleMongooseError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  else if(err?.name === "CastError") {
    // if(err instance of mongoose.error.casterror) ei vabe dileo hobe
    const simplifiedError = HandleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  else if(err?.code === 11000) {
    const simplifiedError = HandleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  else if(err instanceof AppError) {
    
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [{
      path: '',
      message: err?.message
    }];
  }
  else if(err instanceof Error) {
    // ei error k sobar last e hangle korte hobe. na hole sob err er to Error er moddhe pore tai agei ei if block e dhukbe
  
    message = err?.message;
    errorSources = [{
      path: '',
      message: err?.message
    }];
  }


  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
    err
  });
};

export default globalErrorHandler;


/*
error pattern

success
message
errorSources : [
   'path': '',
   'message' : ''
]
stack   


*/