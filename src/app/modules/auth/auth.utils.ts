import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { id: string; role: string },
  secret: string,
  expire_in: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expire_in,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
