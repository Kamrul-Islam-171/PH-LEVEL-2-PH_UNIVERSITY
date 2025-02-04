import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async(req, res) => {
    const result = await AuthServices.loginUser(req.body);

    // access token k local storage eo save korte pari. but cookie( recommended )

    const {refreshToken, accessToken, needsPasswordChange} = result;
    //cockiee the set korbo refresh token
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken, needsPasswordChange
        }
    })
})

const changePassword = catchAsync(async(req, res) => {
    
    // console.log(req.user, req.body);
    
    const {...passwordData} = req.body;
    const result = await AuthServices.changePassword(req.user, passwordData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully',
        data: result
        // data: null
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved succesfully!',
      data: result,
    });
  });


  const forgetPassword = catchAsync(async (req, res) => {
    // const { refreshToken } = req.cookies;
    const userId = req.body.id;
    const result = await AuthServices.forgetPass(userId);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reset link is generated succesfully!',
      data: result,
    });
  });

  const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    console.log('reset = ', token)
  
    const result = await AuthServices.resetPassword(req.body, token as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset succesful!',
      data: result,
    });
  });
  

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
}