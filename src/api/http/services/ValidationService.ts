import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class ValidationService {
  async validateProfile(data: TCampaignSettingsProfile): Promise<AxiosResponse<unknown>> {
    return $api.post('/settings/validate/profile', data);
  }
  async validateGeo(data: TCampaignSettingsTargetGEO): Promise<AxiosResponse<unknown>> {
    return $api.post('/settings/validate/geo', data);
  }
  async validateSearch(data: TCampaignSettingsTargetSearch): Promise<AxiosResponse<unknown>> {
    return $api.post('/settings/validate/search', data);
  }
  async validateFunnel(data: TCampaignSettingsFunnel): Promise<AxiosResponse<unknown>> {
    return $api.post('/settings/validate/funnel', data);
  }
}

export default new ValidationService();
