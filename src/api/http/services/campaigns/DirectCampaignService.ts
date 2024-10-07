import { $api } from '@api/http/axios';
import { AxiosResponse } from 'axios';

class DirectCampaignService {
  async getDirectCampaigns(page: number): Promise<AxiosResponse<TDirectCampaignsResponse>> {
    return $api.get('/campaigns/direct', {
      params: {
        page,
      },
    });
  }
  async getDirectCampaign(id: number): Promise<AxiosResponse<TDirectCampaignSettingsResponse>> {
    return $api.get(`/campaigns/direct/${id}`);
  }
  async startCampaign(id: number): Promise<AxiosResponse<TDirectCampaignResponse>> {
    return $api.post(`/campaigns/direct/${id}/start`);
  }
  async stopCampaign(id: number): Promise<AxiosResponse<TDirectCampaignResponse>> {
    return $api.post(`/campaigns/direct/${id}/stop`);
  }
  async createDirectCampaign(data: TDirectCampaignSettings): Promise<AxiosResponse> {
    return $api.post('/campaigns/direct', data);
  }
  async editDirectCampaign(id: number, data: TPartialDirectCampaignSettings): Promise<AxiosResponse> {
    return $api.patch(`/campaigns/direct/${id}`, data);
  }
  async deleteDirectCampaign(id: number): Promise<AxiosResponse> {
    return $api.delete(`/campaigns/direct/${id}`);
  }
}

export default new DirectCampaignService();
