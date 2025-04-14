import axios from 'axios';
import { PaymobServiceInterface } from '../../domain/interfaces/paymob-service.interface';
import { PaymentIntention } from '../../domain/entities/payment-intention.entity';

export class PaymobService implements PaymobServiceInterface {
  private readonly baseUrl: string | undefined;
  private readonly secretKey: string | undefined;
  private readonly paymobUnifiedCheckoutURL: string | undefined;
  private readonly paymobPublicKey: string | undefined;

  constructor() {
    this.baseUrl = process.env.PAYMOB_BASE_URL;
    this.secretKey = process.env.PAYMOB_SECRET_KEY;
    this.paymobUnifiedCheckoutURL = process.env.PAYMOB_UNIFIED_CHECKOUT_URL;
    this.paymobPublicKey = process.env.PAYMOB_PUBLIC_KEY;
  }

  async createPaymentIntention(paymentIntention: PaymentIntention): Promise<{ id: string; iframeUrl: string }> {
    try {
      const intentionResponse = await axios.post(
        `${this.baseUrl}/intention/`,
        paymentIntention,
        {
          headers: {
            Authorization: `Token ${this.secretKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        id: intentionResponse.data.id,
        iframeUrl: `${this.paymobUnifiedCheckoutURL}?publicKey=${this.paymobPublicKey}&clientSecret=${intentionResponse.data.client_secret}`
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paymob API Error: ${error.response?.data?.detail || error.message}`);
      }
      throw error;
    }
  }
} 