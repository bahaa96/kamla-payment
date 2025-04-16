import { Router } from 'express';
import { TypeformController } from '../controllers/typeform.controller';

const router = Router();
const typeformController = new TypeformController();

router.post('/webhook', typeformController.handleWebhook.bind(typeformController));

export default router; 