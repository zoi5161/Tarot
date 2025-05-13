import express from 'express';
import OrderController from '../controllers/OrderController';

const router = express.Router();

router.post('/orders', OrderController.createOrder);
router.put('/orders/status', OrderController.updateOrderStatus);
router.get('/orders', OrderController.getAllOrders);
router.delete('/orders/:orderId', OrderController.deleteOrder);

export default router;
