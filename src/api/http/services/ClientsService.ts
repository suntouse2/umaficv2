import { AxiosResponse } from 'axios'
import { $api } from '../axios'

class ClientsService {
	async getMe(): Promise<AxiosResponse<TUser>> {
		return $api.get('/clients/me')
	}
}

export default new ClientsService()
