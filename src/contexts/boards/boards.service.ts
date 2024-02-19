import { Request, Response } from "express";
import prismaClient from "../../prisma/client.prisma";

class BoardsService {
  async createBoards(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const board = await prismaClient.board.create({
        data: {
          name,
        },
      });
      res.status(201).json(board);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const boardsService = new BoardsService();

export default boardsService;
