import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class AuthService {
  async get_access_token(access_link: string): Promise<AxiosResponse<TAuthResponse>> {
    return $api.get(`/auth`, {
      params: {
        access_link,
      },
    });
  }
  async get_user(): Promise<AxiosResponse<TUserResponse>> {
    return $api.get('/clients/me');
  }
}

export default new AuthService();
