const ProductController=require("../controller/product.controller");
const { auth, IsAdmin, IsUser } = require("../utils/auth");
const upload =require("../utils/image.add")
const router=require("express").Router();
/**
 * @swagger
 * /productadd:
 *   post:
 *     summary: Add a new product
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               lowStockThreshold:
 *                 type: number
 *             example:
 *               name: Sample Product
 *               description: This is a sample product description.
 *               price: 99.99
 *               stock: 20
 *               lowStockThreshold: 5
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/productadd",auth,IsAdmin,upload.single("image"),ProductController.creteProduct)
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all products
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/",auth,IsAdmin,ProductController.GetAllProduct)
/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id",auth,IsAdmin,ProductController.GetIdProduct)
/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id",auth,IsAdmin,ProductController.DeleteProduct)
/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               lowStockThreshold:
 *                 type: number
 *             example:
 *               name: Updated Product
 *               description: Updated description for the product.
 *               price: 149.99
 *               stock: 10
 *               lowStockThreshold: 3
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.patch("/:id",auth,IsAdmin,upload.single("image"),ProductController.UpdateProduct)
/**
 * @swagger
 * /inventory/low-stock:
 *   get:
 *     summary: Check products with low stock
 *     tags: [Product Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low-stock products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/inventory/low-stock', auth,IsAdmin,ProductController.checkStock);

module.exports=router;