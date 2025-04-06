import swaggerJsDoc, { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Aplica o esquema de segurança globalmente (pode ser sobrescrito por rota)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export default swaggerSpecs;
