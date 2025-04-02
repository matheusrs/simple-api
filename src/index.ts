import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger";
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas públicas e privadas
app.use("/public", publicRoutes);
app.use("/private", privateRoutes);

// Rota para a documentação interativa com Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware de tratamento de erros
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
