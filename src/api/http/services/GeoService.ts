import { AxiosResponse } from 'axios'
import { $api } from '../axios'

class GeoService {
	async getLanguages(): Promise<AxiosResponse<{ [key: string]: string }>> {
		return $api.get('/geo/languages')
	}

	async getCountries(
		languages?: string[]
	): Promise<AxiosResponse<{ [key: string]: string }>> {
		return $api.get('/geo/countries', {
			params: {
				languages,
			},
			paramsSerializer: {
				indexes: null,
			},
		})
	}
	async getRegions(
		countries?: string[]
	): Promise<AxiosResponse<{ [key: string]: string }>> {
		return $api.get('/geo/regions', {
			params: {
				countries,
			},
			paramsSerializer: {
				indexes: null,
			},
		})
	}
	async getCities(regions?: string[]): Promise<AxiosResponse<{ [key: string]: string }>> {
		return $api.get('/geo/cities', {
			params: {
				regions,
			},
			paramsSerializer: {
				indexes: null,
			},
		})
	}
}
export default new GeoService()
