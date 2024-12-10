import { AxiosResponse } from 'axios'
import { $api } from '../axios'

class ChannelService {
	async addChannels(data: TAddChannelForm): Promise<AxiosResponse> {
		return $api.post(`/channels`, data)
	}
}

export default new ChannelService()
