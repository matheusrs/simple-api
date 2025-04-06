import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @openapi
 * /produtos:
 *   post:
 *     summary: Cria um novo produto.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados do produto a ser criado.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 */
router.post("/", authMiddleware, createProduct);

/**
 * @openapi
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos.
 *     responses:
 *       200:
 *         description: Lista de produtos.
 */
router.get("/", getProducts);

/**
 * @openapi
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *       404:
 *         description: Produto não encontrado.
 */
router.get("/:id", getProduct);

/**
 * @openapi
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       description: Dados para atualizar o produto.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.put("/:id", authMiddleware, updateProduct);

/**
 * @openapi
 * /produtos/{id}:
 *   delete:
 *     summary: Exclui um produto pelo ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
