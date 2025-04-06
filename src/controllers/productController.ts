import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma"; // Importa a instância do Prisma Client
import { Prisma } from "@prisma/client"; // Importa tipos úteis do Prisma, como erros

// --- Schemas de Validação (Zod) ---

// Schema para criação (campos obrigatórios, exceto talvez description)
const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(), // Descrição é opcional
  price: z.number().positive("Preço deve ser um número positivo"),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantidade deve ser um número inteiro não negativo"),
});

// Schema para atualização (todos os campos são opcionais)
const updateProductSchema = createProductSchema.partial();

// --- Controller Functions ---

/**
 * Cria um novo produto no banco de dados.
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Validar Input
  const validationResult = createProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    res
      .status(400)
      .json({ errors: validationResult.error.flatten().fieldErrors });
    return;
  }

  try {
    // 2. Criar Produto usando Prisma
    const newProduct = await prisma.product.create({
      data: validationResult.data, // Passa os dados validados diretamente
    });

    // 3. Retornar Sucesso
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    // Adicionar tratamento para erros específicos do Prisma se necessário
    res.status(500).json({ error: "Erro interno ao criar o produto." });
  }
};

/**
 * Busca todos os produtos do banco de dados.
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Buscar todos os produtos, ordenados por ID (ou outro campo)
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc", // ou 'name', 'price', etc.
      },
      // Opcional: Selecionar apenas campos específicos
      // select: { id: true, name: true, price: true, quantity: true }
    });

    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro interno ao buscar produtos." });
  }
};

/**
 * Busca um produto específico pelo ID.
 */
export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Validar e obter ID
  const idParam = z.coerce
    .number()
    .int()
    .positive("ID deve ser um número inteiro positivo")
    .safeParse(req.params.id);
  if (!idParam.success) {
    res
      .status(400)
      .json({
        error: "ID inválido na URL.",
        details: idParam.error.flatten().fieldErrors,
      });
    return;
  }
  const productId = idParam.data;

  try {
    // 2. Buscar Produto Único pelo ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    // 3. Verificar se o produto foi encontrado
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Produto não encontrado." });
    }
  } catch (error) {
    console.error(`Erro ao buscar produto ${productId}:`, error);
    res.status(500).json({ error: "Erro interno ao buscar o produto." });
  }
};

/**
 * Atualiza um produto existente pelo ID.
 */
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Validar e obter ID
  const idParam = z.coerce
    .number()
    .int()
    .positive("ID deve ser um número inteiro positivo")
    .safeParse(req.params.id);
  if (!idParam.success) {
    res
      .status(400)
      .json({
        error: "ID inválido na URL.",
        details: idParam.error.flatten().fieldErrors,
      });
    return;
  }
  const productId = idParam.data;

  // 2. Validar Corpo da Requisição (parcial)
  const validationResult = updateProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    res
      .status(400)
      .json({ errors: validationResult.error.flatten().fieldErrors });
    return;
  }

  // Garante que pelo menos um campo foi enviado para atualização
  if (Object.keys(validationResult.data).length === 0) {
    res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
    return;
  }

  try {
    // 3. Atualizar Produto usando Prisma
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: validationResult.data, // Passa apenas os campos validados presentes no body
    });

    // 4. Retornar Produto Atualizado
    res.json(updatedProduct);
  } catch (error) {
    console.error(`Erro ao atualizar produto ${productId}:`, error);
    // 5. Tratar Erro Específico: Produto não encontrado para atualização
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // P2025: "An operation failed because it depends on one or more records that were required but not found."
      res
        .status(404)
        .json({ error: "Produto não encontrado para atualização." });
    } else {
      // Outros erros do Prisma ou inesperados
      res.status(500).json({ error: "Erro interno ao atualizar o produto." });
    }
  }
};

/**
 * Deleta um produto pelo ID.
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Validar e obter ID
  const idParam = z.coerce
    .number()
    .int()
    .positive("ID deve ser um número inteiro positivo")
    .safeParse(req.params.id);
  if (!idParam.success) {
    res
      .status(400)
      .json({
        error: "ID inválido na URL.",
        details: idParam.error.flatten().fieldErrors,
      });
    return;
  }
  const productId = idParam.data;

  try {
    // 2. Deletar Produto usando Prisma
    await prisma.product.delete({
      where: { id: productId },
    });

    // 3. Retornar Sucesso (Sem conteúdo)
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar produto ${productId}:`, error);
    // 4. Tratar Erro Específico: Produto não encontrado para deleção
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Produto não encontrado para deleção." });
    } else {
      // Outros erros
      res.status(500).json({ error: "Erro interno ao deletar o produto." });
    }
  }
};
