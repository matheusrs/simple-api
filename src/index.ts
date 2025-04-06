import cookieParser from "cookie-parser";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import privateRoutes from "./routes/privateRoutes";
import productRoutes from "./routes/productRoutes";
import publicRoutes from "./routes/publicRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Rotas públicas e privadas
app.use("/public", publicRoutes);
app.use("/private", privateRoutes);
app.use("/auth", authRoutes);
app.use("/produtos", productRoutes);

// Rota para a documentação interativa com Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
