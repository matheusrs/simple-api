import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface HttpError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error("----------------------------------------");
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error(`Path: ${req.path}`);
  console.error(`Method: ${req.method}`);

  console.error("Error Stack:", err.stack || err);
  console.error("----------------------------------------");

  let statusCode: number = err.statusCode || 500;
  let clientMessage: unknown = "Ocorreu um erro inesperado no servidor.";

  //
  if (err instanceof ZodError) {
    statusCode = 400;
    clientMessage = {
      error: "Erro de validação nos dados de entrada.",
      details: err.flatten().fieldErrors,
    };
  } else if (err instanceof TokenExpiredError) {
    statusCode = 403;
    clientMessage = { error: "Token expirado. Faça login novamente." };

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 403;
    clientMessage = { error: "Token inválido ou malformado." };
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  } else if (statusCode === 409) {
    clientMessage = {
      error: err.message || "Recurso já existe ou está em conflito.",
    };
  } else if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
    clientMessage = {
      error: err.message || "Acesso negado ou recurso não encontrado.",
    };
  }
  //

  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    clientMessage = { error: "Ocorreu um erro inesperado no servidor." };
  } else if (statusCode === 500 && process.env.NODE_ENV !== "production") {
    clientMessage = {
      error: "Erro Interno no Servidor",
      message: err.message,
      stack: err.stack,
    };
  }

  res.status(statusCode).json(clientMessage);
};

// Opcional: Classe de Erro Customizada
// export class ApiError extends Error implements HttpError {
//   public statusCode: number;
//   public isOperational: boolean;

//   constructor(message: string, statusCode: number, isOperational: boolean = true) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational; // Erros esperados vs bugs
//     Error.captureStackTrace(this, this.constructor); // Mantém o stack trace correto
//   }
// }
