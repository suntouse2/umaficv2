import { AxiosResponse } from 'axios'
import { $api } from '../axios'

class AuthService {
	async getAccessToken({
		access_link,
	}: {
		access_link: string
	}): Promise<AxiosResponse<TAuth>> {
		return $api.get(`/auth`, {
			params: {
				access_link,
			},
		})
	}
}

export default new AuthService()
