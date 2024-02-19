import { User } from "@prisma/client";
import { Request, Response } from "express";
import prismaClient from "../../prisma/client.prisma";

class UsersService {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await prismaClient.user.findMany();
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }

      console.log(users);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getUser(req: Request<{ userId: string }>, res: Response) {
    const parsedUserId = Number(req.params.userId);
    if (isNaN(parsedUserId)) throw new Error("UserId is not a number");

    const user = await prismaClient.user.findUnique({
      where: { id: Number(req.params.userId) },
      include: {
        profile: true,
      },
    });

    res.json(user);
  }

  // 회원 정보 수정
  async updateUser(
    req: Request<
      { userId: string },
      Omit<User, "encryptedPassword">,
      { email: string }
    >,
    res: Response
  ) {
    const parsedUserId = Number(req.params.userId);
    if (isNaN(parsedUserId)) throw new Error("UserId is not a number");

    const { email } = req.body;

    const user = await prismaClient.user.update({
      where: { id: parsedUserId },
      data: { email },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) throw new Error("User Not Found");

    res.json(user);
  }

  // 회원삭제
  async deleteUser(req: Request<{ userId: string }>, res: Response) {
    const parsedUserId = Number(req.params.userId);
    if (isNaN(parsedUserId)) throw new Error("UserId is not a number");

    const user = await prismaClient.user.delete({
      where: { id: parsedUserId },
    });

    if (!user) throw new Error("User Not Found");
    res.json(user);
  }
}

const usersService = new UsersService();

export default usersService;
