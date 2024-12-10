import { AxiosResponse } from 'axios'
import { $api } from '../axios'

class UtilsService {
	async spintax(message: string, max_variants: number): Promise<AxiosResponse<string[]>> {
		return $api.post('/utils/spintax', {
			message,
			max_variants,
		})
	}
	async variants(message: string): Promise<AxiosResponse<string[]>> {
		return $api.post('/utils/spintax', {
			message,
		})
	}
}
export default new UtilsService()
