// src/config/swagger.ts

import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API REST",
      version: "1.0.0",
      description:
        "API REST com autenticação customizada, refresh token, CRUD de usuários e produtos",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // Caminho para os arquivos que contêm anotações do Swagger (rotas, controllers, etc.)
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
