import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class SpintaxService {
  async spintax(message: string, max_variations: number): Promise<AxiosResponse<TSpintaxResponse>> {
    return $api.post('/settings/utils/spintax', {
      message: message,
      max_variations: max_variations,
    });
  }
}
export default new SpintaxService();
