import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class MediaService {
  async uploadFile(file: File): Promise<AxiosResponse<TMediaUploadResponse>> {
    return $api.postForm('/media/upload', {
      file: file,
    });
  }
  async downloadFile(filename: string): Promise<AxiosResponse<Blob>> {
    return $api.get(`/media/${filename}`, { responseType: 'blob' });
  }
  async exitsFile(filename: string): Promise<AxiosResponse<boolean>> {
    return $api.get('/media/exists', {
      params: { filename },
    });
  }
}
export default new MediaService();
