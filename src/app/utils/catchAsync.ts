import { NextFunction, Request, RequestHandler, Response } from "express";


//higher order function
const catchAsync = (fn: RequestHandler) => {
  // fn(req, res, next) = function calling
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
