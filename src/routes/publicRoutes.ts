import { Router, Request, Response } from "express";

const router = Router();

/**
 * @openapi
 * /public/info:
 *   get:
 *     summary: Retorna informações públicas da API.
 *     responses:
 *       200:
 *         description: Informações públicas retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informações públicas da API
 */
router.get("/info", (req: Request, res: Response): void => {
  res.json({ message: "Informações públicas da API" });
});

export default router;
