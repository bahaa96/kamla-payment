import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.post('/payment-intention', paymentController.createPaymentIntention.bind(paymentController));

export default router; 