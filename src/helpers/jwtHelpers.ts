import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const generateToken = (
  payload: any,
  secret: string,
  expiredIn: string
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiredIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
