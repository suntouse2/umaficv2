import { $api } from '@api/http/axios'
import { AxiosResponse } from 'axios'

class PrCampaignService {
	async getPrCampaigns(
		page: number,
		is_moderated?: boolean | null,
		state?: 'pending' | 'preparing' | 'active' | 'inactive' | null,
		orders: string[] | null = null
	): Promise<AxiosResponse<TPRCampaign[]>> {
		return $api.get('/campaigns/pr', {
			params: {
				page,
				is_moderated,
				state,
				orders,
			},
		})
	}

	async getPrCampaign(campaign_id: number): Promise<AxiosResponse<TPRCampaignSettings>> {
		return $api.get(`/campaigns/pr/${campaign_id}`)
	}

	async createPrCampaign(
		data: TPRCampaignSettings,
		return_result = true
	): Promise<AxiosResponse<TPRCampaign>> {
		return $api.post('/campaigns/pr', data, {
			params: {
				return_result,
			},
		})
	}

	async editPrCampaign(
		campaign_id: number,
		data: Partial<TPRCampaignSettings>
	): Promise<AxiosResponse<{ msg: string }>> {
		return $api.patch(`/campaigns/pr/${campaign_id}`, data)
	}

	async deletePrCampaign(campaign_id: number): Promise<AxiosResponse<{ msg: string }>> {
		return $api.delete(`/campaigns/pr/${campaign_id}`)
	}
}

export default new PrCampaignService()
