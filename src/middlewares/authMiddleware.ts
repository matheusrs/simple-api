import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "fallback_access_token_secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: `Token inválido` });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, _decoded) => {
    if (err) {
      res.status(403).json({ error: `Token inválido ou expirado ${err}` });
      return;
    }
    // req.user = decoded;
    next();
  });
};
