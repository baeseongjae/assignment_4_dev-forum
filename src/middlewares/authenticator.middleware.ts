import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import prismaClient from "../prisma/client.prisma";

const freePassRoutes = ["/auth/sign-up", "/auth/log-in"];

export default async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 여권 발급 받으러 왔니? 지나가
  if (freePassRoutes.includes(req.originalUrl)) {
    return next();
  }

  // 여권 가져왔니? 안 가져왔으면 돌아가
  const accessToken = req.headers.authorization?.split("Bearer ")[1];
  if (!accessToken) return res.sendStatus(401);

  // 여권 유효한 거 맞니?
  try {
    const decodedToken = jwt.verify(accessToken, JWT_SECRET_KEY);

    if (typeof decodedToken === "object" && "userId" in decodedToken) {
      const userId = decodedToken.userId;
      const parsedId = Number(userId);

      if (isNaN(parsedId)) {
        return res.sendStatus(401);
      }
      const user = await prismaClient.user.findUnique({
        where: { id: parsedId },
      });
      if (!user) return res.sendStatus(404);

      req.user = {
        id: String(user.id),
        encryptedPassword: user.encryptedPassword,
      };
    } else {
      return res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }

  next();
}
