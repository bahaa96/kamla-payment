import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';

const router = Router();
const submissionController = new SubmissionController();

router.get('/get-submission', submissionController.getSubmission.bind(submissionController));

export default router; 