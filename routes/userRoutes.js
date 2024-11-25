import { Router } from "express";
import { getUsers, login, signup } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", signup)

userRouter.post("/login", login)

userRouter.get("/user", getUsers)

export default userRouter;