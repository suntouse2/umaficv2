import { $api } from '@api/http/axios';
import { AxiosResponse } from 'axios';

class DirectService {
  async getDirects(campaign_id: number, page: number, filter?: { is_open?: boolean; is_favorite?: boolean }): Promise<AxiosResponse<TChatDirectsResponse>> {
    return $api.get('/directs', {
      params: {
        ...filter,
        page,
        campaign_id,
      },
    });
  }
  async getDirect(direct_id: number): Promise<AxiosResponse<TChatDirectResponse>> {
    return $api.get(`/directs/${direct_id}`, {});
  }
  async updateDirect(direct_id: number, data: TChatDirectStatusUpdate): Promise<AxiosResponse> {
    return $api.patch(`/directs/${direct_id}`, { ...data });
  }
  async removeDirect(direct_id: number): Promise<AxiosResponse> {
    return $api.delete(`/directs/${direct_id}`);
  }
  async getDirectMessages(direct_id: number, page: number = 1): Promise<AxiosResponse<TChatDirectMessagesResponse>> {
    return $api.get(`/directs/${direct_id}/messages`, {
      params: {
        page,
      },
    });
  }
  async readMessage(direct_id: number, message_id: number): Promise<AxiosResponse> {
    return $api.patch(`/directs/${direct_id}/messages`, {
      dto: {
        is_read: true,
      },
      ids: [],
      max_id: message_id,
      min_id: 0,
    });
  }
  async sendMessage(direct_id: number, msg: TChatSendMessage): Promise<AxiosResponse<{ catch_slug: string }>> {
    return $api.post(`/directs/${direct_id}/sendMessage`, msg);
  }
}
export default new DirectService();
