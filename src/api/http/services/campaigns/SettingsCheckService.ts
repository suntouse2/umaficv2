import { $api } from '@api/http/axios';
import { AxiosResponse } from 'axios';

class SettingsCheckService {
  async getStatistic(data: TCampaignSettingsTarget): Promise<AxiosResponse<TCampaignSettingsCheckStatisticsResponse>> {
    return $api.post('/settings/check/messagesTarget/statistics', data);
  }
  async getMessages(data: TCampaignSettingsTarget, page: number): Promise<AxiosResponse<TCampaignSettingsCheckFoundMessagesResponse>> {
    return $api.post('/settings/check/messagesTarget/messages', data, {
      params: {
        page,
      },
    });
  }
}
export default new SettingsCheckService();
