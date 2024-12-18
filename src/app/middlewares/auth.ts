import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/users/users.interface";
import { UserModel } from "../modules/users/users.model";

const Auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log('Hell = ',req.headers.authorization );
    // console.log('Hell = ',req.headers.Authorization);
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
    }

    //check if the token is correct
    const decoded = jwt.verify(
      token,
      config.access_secret as string
    ) as JwtPayload;

    // console.log(decoded)

    const {role, id, iat} = decoded ;

    const user = await UserModel.isUserExistsByCustomID(id);

    // console.log(user);
    // console.log(token)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
    }
    // check if the user is deleted from db
    const isUserDeleted = user?.isDeleted;
    if (isUserDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is Deleted!");
    }
  
    //check if the user is blocked
    const userStauts = user?.status;
    if (userStauts === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
    }

    if(user.passwordChangeAt && UserModel.isJWTIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)) {
      throw new AppError(httpStatus.FORBIDDEN, 'pass changed recently and token expired')
    }


    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
    }

    //then ei id r role amra req e add kore dibo. jate pore req theke ei data nite pari
    // er jonno interface folder e index.d.ts file lagbe
    req.user = decoded as JwtPayload;

    // jwt.verify(token, config.access_secret as string, function (err, decoded) {
    //   //  console.log(decoded)
    //   if (err) {
    //     throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
    //   }
    //   // console.log(decoded)
    //   // const {id, role} = decoded;
    //   // console.log(id, role)

    //   const role = (decoded as JwtPayload).role;
    //   if(requiredRole && !requiredRole.includes(role)) {
    //     throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
    //   }

    //   //then ei id r role amra req e add kore dibo. jate pore req theke ei data nite pari
    //   // er jonno interface folder e index.d.ts file lagbe
    //   req.user = decoded as JwtPayload;

    // });

    next();
  });
};

export default Auth;
