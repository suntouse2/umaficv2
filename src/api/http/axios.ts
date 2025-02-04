import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_API_URL

const AUTH_ERROR_STATUS = 401
const NO_BALANCE_STATUS = 402

export const $api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
	return config
})

//status handlers
$api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	async (error: AxiosError) => {
		const originalRequest = error.config

		switch (error.response?.status) {
			case NO_BALANCE_STATUS:
				toast.error('Недостаточно баланса')
				break
			case AUTH_ERROR_STATUS:
				try {
					const response = await axios.get<{ access_token: string }>(
						`${BASE_URL}/auth/refresh`,
						{
							withCredentials: true,
						}
					)
					localStorage.setItem('access_token', response.data.access_token)
					return originalRequest ? $api.request(originalRequest) : undefined
				} catch {
					console.log('не удалось обновить сессию')
				}
				break
			default:
				if (error instanceof AxiosError) {
					const requestPath = error.config?.url || 'Неизвестный путь'
					const requestMethod = error.config?.method?.toUpperCase() || 'Неизвестный метод'
					const requestData = error.config?.data ? JSON.parse(error.config.data) : null

					console.error('Axios Error:', {
						status: error.response?.status,
						data: error.response?.data,
						headers: error.response?.headers,
						request: {
							path: requestPath,
							method: requestMethod,
							data: requestData,
						},
					})
				} else {
					console.error('Unknown Error:', error)
				}
				break
		}
		throw error
	}
)
