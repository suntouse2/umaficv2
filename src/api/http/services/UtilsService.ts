import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class UtilsService {
  async spintax(message: string, max_variations: number): Promise<AxiosResponse<TSpintaxResponse>> {
    return $api.post('/settings/utils/spintax', {
      message: message,
      max_variations: max_variations,
    });
  }
  async variants(message: string): Promise<AxiosResponse<TSpintaxResponse>> {
    return $api.post('/settings/utils/variants', {
      message: message,
    });
  }
}
export default new UtilsService();
