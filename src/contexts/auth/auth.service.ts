import bcrypt from "bcrypt";
import { Request, Response } from "express";
import prismaClient from "../../prisma/client.prisma";
import { ErrorResponse, User } from "./auth.type";
import { generateAccessToken } from "./auth.utils";

export const users: Array<{ id: string; encryptedPassword: string }> = [];

class AuthService {
  //회원 생성
  async signUp(
    req: Request<
      never,
      unknown,
      {
        email: string;
        password: string;
        nickname: string;
        name: string;
        gender: string;
        age: number;
      }
    >,
    res: Response<Omit<User, "encryptedPassword"> | ErrorResponse>
  ) {
    try {
      const { email, password, nickname, name, gender, age } = req.body;

      // validation 로직예시 - 프론트에서 하겠지만 믿으면 안되고 백에서도 해야함
      if (!email.trim()) throw new Error("No Email!");
      if (!password.trim()) throw new Error("No password!");

      // bcrypt 활용한 비밀번호 해싱
      const encryptedPassword = await bcrypt.hash(password, 12);

      // 사용자 생성 및 DB에 저장
      const user = await prismaClient.user.create({
        data: {
          email,
          encryptedPassword,
          profile: { create: { nickname, name, gender, age } },
        },
        select: { id: true, email: true, createdAt: true, profile: true },
      });

      // JWT 생성
      const accessToken = generateAccessToken(user);

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async logIn(
    req: Request,
    res: Response<Omit<User, "encryptedPassword"> | ErrorResponse>
  ) {
    try {
      const { email, password } = req.body;

      // db에 유저 조회
      const user = await prismaClient.user.findUnique({
        where: { email: email },
        include: { profile: true },
      });
      if (!user) return res.sendStatus(404);

      // 비밀번호 검증
      const isVerified = await bcrypt.compare(password, user.encryptedPassword);
      if (!isVerified) return res.sendStatus(400);

      // JWT 생성
      const accessToken = generateAccessToken(user);

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async logOut(req: Request, res: Response) {}

  async refreshToken(req: Request, res: Response) {}
}
const authService = new AuthService();

export default authService;
