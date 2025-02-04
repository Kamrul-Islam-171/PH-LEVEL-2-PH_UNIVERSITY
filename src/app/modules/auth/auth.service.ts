import config from "../../config";
import AppError from "../../errors/AppError";
import { UserModel } from "../users/users.model";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const { id } = payload;

  //check if the user is exists
  // const isUserExists = await UserModel.findOne({id});
  // if(!isUserExists) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'User is not found!')
  // }

  const user = await UserModel.isUserExistsByCustomID(payload?.id);

  // console.log(user);
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

  // //check if the password is matched
  // const isPasswordMatched = await bcrypt.compare(payload?.password, isUserExists?.password);
  // // const isPasswordMatched = await bcrypt.compare( 'admin123',isUserExists?.password);
  // // console.log(typeof(payload?.password))

  const isPasswordMatched = await UserModel.isPasswordMatched(
    payload?.password,
    user?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
  }

  //now we will create a token and save it in a variable

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };
  // const accessToken = jwt.sign(jwtPayload, config.access_secret as string, {
  //   expiresIn: "10d",
  // });
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expire as string
  );

  // const regressToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
  //   expiresIn: "360d",
  // });

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_expire as string
  );

  //return korle post man e show hobe
  return { accessToken,refreshToken, needsPasswordChange: user?.needsPasswordChange };

  // console.log('pass match = ',isPasswordMatched)
  // console.log(isUserExists)
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // console.log(user)

  const user = await UserModel.isUserExistsByCustomID(userData?.id);

  // console.log(user);
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

  // //check if the password is matched
  // const isPasswordMatched = await bcrypt.compare(payload?.password, isUserExists?.password);
  // // const isPasswordMatched = await bcrypt.compare( 'admin123',isUserExists?.password);
  // // console.log(typeof(payload?.password))

  // now check if old pass is matched or not
  const isPasswordMatched = await UserModel.isPasswordMatched(
    payload?.oldPassword,
    user?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
  }

  // now hash new pass
  const newHashedPass = await bcrypt.hash(payload?.newPassword, 12);

  await UserModel.findOneAndUpdate(
    { id: userData.id, role: userData.role },
    {
      password: newHashedPass,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    }
  );

  return null; // pass pathano jabe na. tai null
};


const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;

  const { id, iat } = decoded;

  // checking if the user is exist
  const user = await UserModel.isUserExistsByCustomID(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  // pass change hoileo refresh token invalid hobe
  if (
    user.passwordChangeAt &&
    UserModel.isJWTIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expire as string,
  );

  return {
    accessToken,
  };
};

const forgetPass = async(id:string) => {

  const user = await UserModel.isUserExistsByCustomID(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.access_secret as string,
    '10m',
  );
  console.log(resetToken);

 // link generate kortachi
  const resetUILink = `${config.RESET_PASS_URL}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  // console.log(resetUILink);
}

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {

  const {id} = payload;

  const user = await UserModel.isUserExistsByCustomID(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  // j secret dia token create korchi , oi token dia e verify korte hobe
  const decoded = jwt.verify(
    token,
    config.access_secret as string,
  ) as JwtPayload;

  // console.log(decoded)
  if (payload.id !== decoded.id) {
    console.log(payload.id, decoded.id);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(12),
  );

  await UserModel.findOneAndUpdate(
    {
      id: decoded.id,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPass,
  resetPassword
};
