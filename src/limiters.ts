import rateLimit from "express-rate-limit";

// Limiter para rotas de autenticação (login, register, talvez refresh)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  limit: 10, // Limita cada IP a 10 requisições na janela (ajuste conforme necessário)
  message: {
    error:
      "Muitas tentativas de autenticação a partir deste IP. Tente novamente após 15 minutos.",
  },
  standardHeaders: "draft-7", // Envia headers RateLimit-* (padrão RFC)
  legacyHeaders: false, // Desabilita headers X-RateLimit-*
  // store: // Opcional: Use um store como Redis (rate-limit-redis) para ambientes distribuídos
});

// Limiter geral para outras rotas da API (exemplo)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Janela de 1 minuto
  limit: 100, // Limita cada IP a 100 requisições por minuto (ajuste)
  message: { error: "Limite de requisições excedido." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
