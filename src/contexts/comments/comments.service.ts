import { Request, Response } from "express";
import prismaClient from "../../prisma/client.prisma";

class CommentsService {
  async createComments(req: Request<{ postId: string }>, res: Response) {
    try {
      const parsedPostId = Number(req.params.postId);
      if (!parsedPostId)
        return res.status(400).json({ error: "postId is required" });

      const { content } = req.body;

      const comment = await prismaClient.comment.create({
        data: {
          content,
          postId: parsedPostId,
        },
      });

      res.status(201).json(comment);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getComments(req: Request<{ postId: string }>, res: Response) {
    try {
      const parsedPostId = Number(req.params.postId);
      if (!parsedPostId)
        return res.status(400).json({ error: "postId is required" });

      const comments = await prismaClient.comment.findMany({
        where: {
          postId: parsedPostId,
        },
      });

      res.status(200).json(comments);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateComment(req: Request<{ commentId: string }>, res: Response) {
    try {
      const parsedCommentId = Number(req.params.commentId);
      if (!parsedCommentId)
        return res.status(400).json({ error: "commentId is required" });

      const { content } = req.body;

      const updatedComment = await prismaClient.comment.update({
        where: {
          id: parsedCommentId,
        },
        data: {
          content,
        },
      });

      res.status(200).json(updatedComment);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteComment(req: Request<{ commentId: string }>, res: Response) {
    try {
      const parsedCommentId = Number(req.params.commentId);
      if (!parsedCommentId)
        return res.status(400).json({ error: "commentId is required" });

      await prismaClient.comment.delete({
        where: {
          id: parsedCommentId,
        },
      });

      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const commentsService = new CommentsService();
export default commentsService;
