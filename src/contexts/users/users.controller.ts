import { Router } from "express";
import usersService from "./users.service";

const usersControllers = Router();

usersControllers.get("/", usersService.getUsers);
// usersControllers.get("/:userId", usersService.getUser);
// usersControllers.put("/:userId", usersService.updateUser);
// usersControllers.delete("/:userId", usersService.deleteUser);

export default usersControllers;
