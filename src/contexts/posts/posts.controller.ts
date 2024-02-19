import { Router } from "express";
import postsService from "./posts.service";

const postsController = Router();

postsController.post("/:boardId", postsService.createPost);
postsController.get("/:boardId", postsService.getPosts);
postsController.put("/:boardId/:postId", postsService.updatePost);
postsController.delete("/:boardId/:postId", postsService.deletePost);

export default postsController;
