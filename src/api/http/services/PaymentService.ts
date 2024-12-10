import { $api } from '@api/http/axios'
import { AxiosResponse } from 'axios'

class PaymentService {
	async createPayment(
		data: TCreatePaymentForm
	): Promise<AxiosResponse<TPayment>> {
		return $api.post('/payment/tbank/init', {
			...data,
		})
	}
}
export default new PaymentService()
