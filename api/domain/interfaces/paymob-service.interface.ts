import { PaymentIntention } from '../entities/payment-intention.entity';

export interface PaymobServiceInterface {
  createPaymentIntention(paymentIntention: PaymentIntention): Promise<{
    id: string;
    iframeUrl: string;
  }>;
} 