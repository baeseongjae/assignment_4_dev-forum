import { Request, Response } from "express";
import prismaClient from "../../prisma/client.prisma";

class PostsService {
  async createPost(req: Request<{ boardId: string }>, res: Response) {
    try {
      const parsedBoardId = Number(req.params.boardId);
      if (!req.params.boardId)
        return res.status(400).json({ error: "boardId is required" }); // boardId가 없으면 400 에러 반환
      if (isNaN(parsedBoardId)) throw new Error("BoardId is not a number");

      const { title, content } = req.body;

      const post = await prismaClient.post.create({
        data: {
          title,
          content,
          board: { connect: { id: parsedBoardId } },
        },
        include: { board: true },
      });

      const updatedBoard = await prismaClient.board.findUnique({
        where: { id: parsedBoardId },
        include: { posts: true },
      });

      res.status(201).json(post);
      res.status(201).json(updatedBoard);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getPosts(req: Request<{ boardId: string }>, res: Response) {
    try {
      const parsedBoardId = Number(req.params.boardId);
      if (!req.params.boardId)
        return res.status(400).json({ error: "boardId is required" });

      const posts = await prismaClient.post.findMany({
        where: { boardId: parsedBoardId },
      });

      res.status(200).json(posts);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updatePost(req: Request<{ postId: string }>, res: Response) {
    try {
      const parsedPostId = Number(req.params.postId);
      if (!req.params.postId)
        return res.status(400).json({ error: "boardId is required" });

      const { title, content } = req.body;

      const updatedPost = await prismaClient.post.update({
        where: { id: parsedPostId },
        data: { title, content },
      });

      res.status(200).json(updatedPost);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deletePost(req: Request<{ postId: string }>, res: Response) {
    try {
      const parsedPostId = Number(req.params.postId);
      if (!req.params.postId)
        return res.status(400).json({ error: "boardId is required" });

      await prismaClient.post.delete({ where: { id: parsedPostId } });

      res.status(200).json(parsedPostId);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
const postsService = new PostsService();

export default postsService;
