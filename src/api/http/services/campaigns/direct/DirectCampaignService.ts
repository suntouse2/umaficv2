import { $api } from '@api/http/axios'
import { AxiosResponse } from 'axios'

class DirectCampaignService {
	async getDirectCampaigns(page: number): Promise<AxiosResponse<TDirectCampaign[]>> {
		return $api.get('/campaigns/direct', {
			params: {
				page,
			},
		})
	}
	async getDirectCampaign(id: number): Promise<AxiosResponse<TDirectCampaignSettings>> {
		return $api.get(`/campaigns/direct/${id}`)
	}
	async startCampaign(id: number): Promise<AxiosResponse> {
		return $api.post(`/campaigns/direct/${id}/start`)
	}
	async stopCampaign(id: number): Promise<AxiosResponse> {
		return $api.post(`/campaigns/direct/${id}/stop`)
	}
	async createDirectCampaign(settings: TDirectCampaignSettings): Promise<AxiosResponse> {
		return $api.post('/campaigns/direct', settings)
	}
	async editDirectCampaign(
		id: number,
		settings: Partial<TDirectCampaignSettings>
	): Promise<AxiosResponse> {
		return $api.patch(`/campaigns/direct/${id}`, settings)
	}
	async deleteDirectCampaign(id: number): Promise<AxiosResponse> {
		return $api.delete(`/campaigns/direct/${id}`)
	}
	async getStatistic(
		data: TDirectCampaignSettingsTarget
	): Promise<AxiosResponse<TDirectCampaignSettingsCheckStatistics>> {
		return $api.post('/campaigns/direct/check/statistics', data)
	}
	async getMessages(
		data: TDirectCampaignSettingsTarget,
		page: number
	): Promise<AxiosResponse<TDirectCampaignSettingsCheckMessages[]>> {
		return $api.post('/campaigns/direct/check/messages', data, {
			params: {
				page,
			},
		})
	}
	async getChats(
		data: TDirectCampaignSettingsTargetGEO
	): Promise<AxiosResponse<TDirectCampaignSettingsCheckChats>> {
		return $api.post('/campaigns/direct/check/chats', data)
	}
}

export default new DirectCampaignService()
