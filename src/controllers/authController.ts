import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { TokenPayload } from "../interfaces";
import { loginSchema, registerSchema } from "../schemas";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/userService";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET_FALLBACK";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET_FALLBACK";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "12", 10);
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error(
    "ERRO FATAL: Variáveis de ambiente ACCESS_TOKEN_SECRET ou REFRESH_TOKEN_SECRET não definidas."
  );
  if (IS_PRODUCTION) {
    process.exit(1);
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    res
      .status(400)
      .json({ errors: validationResult.error.flatten().fieldErrors });
    return;
  }

  const { username, email, password } = validationResult.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Este email já está em uso." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser(username, hashedPassword, email);

    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    res
      .status(201)
      .json({ message: "Usuário registrado com sucesso!", user: userResponse });
  } catch (error) {
    console.error("Erro no registro:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ");
        res.status(409).json({
          error: `Erro de conflito. O campo '${target || "único"}' já está em uso.`,
        });
        return;
      }
    }
    res.status(500).json({
      error: "Ocorreu um erro inesperado ao tentar registrar o usuário.",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    res
      .status(400)
      .json({ errors: validationResult.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = validationResult.data;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    //
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    const payload: TokenPayload = { userId: user.id };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro inesperado durante o login." });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentRefreshToken = req.cookies?.refreshToken;
  if (!currentRefreshToken) {
    res.status(401).json({ error: "Refresh token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(
      currentRefreshToken,
      REFRESH_TOKEN_SECRET
    ) as TokenPayload;

    if (typeof decoded !== "object" || !decoded.userId) {
      throw new JsonWebTokenError("Payload do refresh token inválido.");
    }

    const userExists = await findUserById(decoded.userId);
    if (!userExists || !userExists.isActive) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(403)
        .json({ error: "Usuário associado ao token não é mais válido." });
      return;
    }

    // 4. Gerar novo Access Token (Ok)
    const payload: TokenPayload = { userId: decoded.userId };

    const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // 5. Definir novo Access Token no cookie (Ok)
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // 6. Retornar Sucesso (Ok)
    res.status(200).json({ message: "Token de acesso renovado com sucesso!" });
  } catch (error) {
    // 7. Tratamento de Erro JWT (Ok)
    console.error("Erro ao renovar token:", error);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if (error instanceof TokenExpiredError) {
      res
        .status(403)
        .json({ error: "Refresh token expirado. Faça login novamente." });
    } else if (error instanceof JsonWebTokenError) {
      res.status(403).json({ error: "Refresh token inválido." });
    } else {
      res
        .status(500)
        .json({ error: "Ocorreu um erro inesperado ao renovar o token." });
    }
  }
};
