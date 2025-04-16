import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TypeformSubmission } from '../domain/entities/typeform-submission.entity';
import FirebaseService from '../infrastructure/services/firebase.service';

export class TypeformController {
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = FirebaseService.getInstance();
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      // Extract data from Typeform webhook payload
      const webhookData = req.body;
      
      // Transform and validate the webhook data
      const typeformSubmission = plainToClass(TypeformSubmission, webhookData);
      const errors = await validate(typeformSubmission);
      
      if (errors.length > 0) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map(error => Object.values(error.constraints || {}))
        });
        return;
      }

      // Get form response ID to use as the key
      const responseId = typeformSubmission.form_response.token;
      
      // Extract only the full name and phone number
      const extractedData = this.extractNameAndPhone(typeformSubmission);
      
      // Create the data object to save
      const submissionData = {
        formId: typeformSubmission.form_response.form_id,
        submittedAt: typeformSubmission.form_response.submitted_at,
        fullName: extractedData.fullName,
        phoneNumber: extractedData.phoneNumber
      };

      // Save to Firebase
      await this.firebaseService.saveSubmission(responseId, submissionData);
      console.log('Typeform submission saved to Firebase:', responseId);

      // Respond to Typeform with a success
      res.status(200).json({
        status: 'success',
        message: 'Webhook received and data saved successfully'
      });
    } catch (error) {
      console.error('Error processing Typeform webhook:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }

  /**
   * Helper method to extract only the full name and phone number from the submission
   */
  private extractNameAndPhone(submission: TypeformSubmission): { fullName: string, phoneNumber: string } {
    let fullName = '';
    let phoneNumber = '';
    
    // Process answers to find full name and phone number
    submission.form_response.answers.forEach(answer => {
      // Find the full name field (short_text type with title "Full name")
      if (answer.type === 'text') {
        // Find the field definition to get the title
        const field = submission.form_response.definition.fields.find(
          f => f.id === answer.field.id
        );
        
        if (field && field.title === 'Full name') {
          fullName = answer.text || '';
        }
      }
      
      // Find the phone number
      if (answer.type === 'phone_number') {
        phoneNumber = answer.phone_number || '';
      }
    });
    
    return { fullName, phoneNumber };
  }
} 