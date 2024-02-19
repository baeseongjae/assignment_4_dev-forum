import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config";
import { User } from "./auth.type";

export function generateAccessToken(user: Omit<User, "encryptedPassword">) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      nickname: user.profile?.nickname,
    },
    JWT_SECRET_KEY
  );

  return accessToken;
}
