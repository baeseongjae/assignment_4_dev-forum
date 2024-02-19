import { Router } from "express";
import authController from "./auth/auth.controller";
import boardsController from "./boards/boards.controller";
import commentsController from "./comments/comments.controller";
import postsController from "./posts/posts.controller";
import usersControllers from "./users/users.controller";

export const controllers = Router();

controllers.use("/auth", authController);
controllers.use("/users", usersControllers);

controllers.use("/boards", boardsController);
controllers.use("/boards/posts", postsController);
controllers.use("/posts/:postId/comments", commentsController);
