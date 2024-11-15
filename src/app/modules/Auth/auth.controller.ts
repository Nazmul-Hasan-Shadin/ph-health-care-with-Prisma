import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshtoken } = result;

  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "logged in successful",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "logged in successful",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
    
const user= req.user;

  

  const result = await AuthServices.changePassword(user,req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "password change successful",
    data: result,
  });
});



export const AuthController = {
  loginUser,

  refreshToken,
  changePassword,
};
