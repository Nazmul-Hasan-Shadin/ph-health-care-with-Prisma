import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

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
    "abcdefg",
    "5m"
  );

  const refreshtoken = generateToken(
    { email: userData.email, role: userData.role },
    "abcdefgh",
    "50d"
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

export const AuthServices = {
  loginUser,
  refreshToken,
};
