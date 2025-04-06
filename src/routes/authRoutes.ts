import { Router } from "express";
import { login, refreshToken, register } from "../controllers/authController";
import { authLimiter } from "../limiters";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/register", authLimiter, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens gerados com sucesso.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post("/login", authLimiter, login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Gera um novo access token a partir do refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Novo access token gerado com sucesso.
 *       401:
 *         description: Refresh token não fornecido.
 *       403:
 *         description: Refresh token inválido.
 */
router.post("/refresh", authLimiter, refreshToken);

export default router;
