import { Request, Response } from 'express';
import FirebaseService from '../infrastructure/services/firebase.service';

export class SubmissionController {
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = FirebaseService.getInstance();
  }

  async getSubmission(req: Request, res: Response): Promise<void> {
    try {
      const submissionId = req.query.id as string;
      
      if (!submissionId) {
        res.status(400).json({
          status: 'error',
          message: 'Submission ID is required'
        });
        return;
      }

      const submission = await this.firebaseService.getSubmission(submissionId);
      
      if (!submission) {
        res.status(404).json({
          status: 'error',
          message: 'Submission not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        fullName: submission.fullName || submission.name,
        phoneNumber: submission.phoneNumber || submission.phone,
        email: submission.email || null
      });
    } catch (error) {
      console.error('Error retrieving submission:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }
} 