import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  // Aqui você pode implementar a lógica para decodificar e validar o token
  // Exemplo simplificado:
  if (token !== "seu-token-esperado") {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  // Se o token for válido, permite que a requisição prossiga
  next();
};
