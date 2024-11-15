import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { generateToken, jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import AppError from "../../Errors/AppError";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log(payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrecct");
  }

  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const refreshtoken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.refreshToken_sec as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshtoken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "abcdefgh");

    console.log(decodedData);
  } catch (error) {
    throw new Error("You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    "abcdefg",
    "5m"
  );

  return { accessToken, needPasswordChange: userData.needPasswordChange };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrecct");
  }

  const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "password changed successfully",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_token as string,
    "5m"
  );

  const resetPasswordLink =
    config.jwt.reset_pass_link +
    `?userId:${userData.id}&token=${resetPasswordToken}`;

  console.log(resetPasswordLink);

  await emailSender(
    userData.email,
    `

    <div> 
<p>  Dear user  </p>

<p>  Your password Reset Link 


<a href=${resetPasswordLink}>
    <button> Reset Pass </button>


</a>  </p>




    </div>
   
   `
  );
  

  //http://localhost:3000/reset-pass?email=shadin@gmail.com&token=kjffffffffffirrrrrrrrrrrrrrrr
};
 
const resetPassword=async(token:string,payload:{
  id:string,
  password:string
})=>{
 

const userData= await prisma.user.findFirstOrThrow({
  where:{
    id:payload.id,
    status:UserStatus.ACTIVE
  }
})

const isValidToken=jwtHelpers.verifyToken(token,config.jwt.reset_pass_token as string)

   if (!isValidToken) {
     throw new AppError(503,"forbidden")
   }

   


// hash password
//update into database

 

}

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword
};
