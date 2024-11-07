import express from 'express';
import { createOrder, generateSessionToken, verifyPayment } from '../../controllers/paymentController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order',authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware,verifyPayment);
router.post('/session-token',authMiddleware,generateSessionToken);

export default router;
