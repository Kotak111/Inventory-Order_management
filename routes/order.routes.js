const OrderController=require("../controller/order.controller");
const { auth, IsUser, IsAdmin } = require("../utils/auth");

const router=require("express").Router();

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: No items in the order
 *       500:
 *         description: Server error
 */
router.post("/order", auth, IsUser, OrderController.PlaceOrder);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/:id", auth, IsUser, OrderController.getOrderById);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the order (Pending, Shipped, Delivered)
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, IsAdmin, OrderController.updateOrderStatus);

/**
 * @swagger
 * /orderuser:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/orderuser", auth, IsUser, OrderController.getAllOrdersByUser);

module.exports=router;