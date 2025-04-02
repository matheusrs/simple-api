import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  (req: Request, res: Response): void => {
    res.json({ message: "Bem-vindo à área privada" });
  }
);

export default router;
