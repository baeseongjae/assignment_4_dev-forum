import { Router } from "express";
import boardsService from "./boards.service";

const boardsController = Router();

boardsController.post("/", boardsService.createBoards);

export default boardsController;
