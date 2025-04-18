import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { PaymentIntention } from '../domain/entities/payment-intention.entity';
import { PaymobService } from '../infrastructure/services/paymob.service';

export class PaymentController {
  private paymobService: PaymobService;
  private readonly paymentSuccessRedirectionURL: string | undefined;
  private readonly paymentErrorRedirectionURL: string | undefined;

  constructor() {
    this.paymobService = new PaymobService();
    this.paymentSuccessRedirectionURL = process.env.PAYMENT_SUCCESS_REDIRECTION_URL;
    this.paymentErrorRedirectionURL = process.env.PAYMENT_ERROR_REDIRECTION_URL;
  }

  async createPaymentIntention(req: Request, res: Response): Promise<void> {
    try {

      const { orderDetails, billingData } = req.body;
      const paymentIntention = new PaymentIntention();
      Object.assign(paymentIntention, {
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        payment_methods: [
          "card",
          "wallet",
        ],
        items: orderDetails.items,
        billing_data: billingData,
        redirection_url: `${this.paymentSuccessRedirectionURL}&name=${billingData.owner.first_name}`
      });


      const errors = await validate(paymentIntention);
      if (errors.length > 0) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map(error => Object.values(error.constraints || {}))
        });
        return;
      }

      const result = await this.paymobService.createPaymentIntention(paymentIntention);
      
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }
} 