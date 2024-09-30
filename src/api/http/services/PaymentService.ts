import { $api } from '@api/http/axios';
import { AxiosResponse } from 'axios';

class PaymentService {
  async sendPayment(data: { email?: string; phone?: string; amount: number }): Promise<AxiosResponse<TPaymentResponse>> {
    return $api.post('/payment/tbank/init', {
      ...data,
    });
  }
}
export default new PaymentService();
