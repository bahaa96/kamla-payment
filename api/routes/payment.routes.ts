import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { SubmissionController } from '../controllers/submission.controller';

const router = Router();
const paymentController = new PaymentController();
const submissionController = new SubmissionController();

router.post('/payment-intention', paymentController.createPaymentIntention.bind(paymentController));
router.get('/get-submission', submissionController.getSubmission.bind(submissionController));

export default router; 