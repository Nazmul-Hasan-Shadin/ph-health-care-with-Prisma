import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRED_IN,

    refreshToken_sec: process.env.REFRESH_TOKEN_SEC,

    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
};
