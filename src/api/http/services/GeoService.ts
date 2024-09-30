import { AxiosResponse } from 'axios';
import { $api } from '../axios';

class GeoService {
  async getLanguages(): Promise<AxiosResponse<TSettingsLanguageResponse>> {
    return $api.get('/settings/geo/languages');
  }

  async getCountries(languages: string[]): Promise<AxiosResponse<TSettingsCountriesResponse>> {
    return $api.get('/settings/geo/countries', {
      params: {
        languages: [languages],
      },
    });
  }
  async getRegions(countries: string[]): Promise<AxiosResponse<TSettingsRegionsResponse>> {
    return $api.get('/settings/geo/regions', {
      params: {
        countries: countries,
      },
    });
  }
  async getCities(regions: string[]): Promise<AxiosResponse<TSettingsCitiesResponse>> {
    return $api.get('/settings/geo/cities', {
      params: {
        regions: regions,
      },
    });
  }
}
export default new GeoService();
