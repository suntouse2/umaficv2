import DirectCampaignService from '@api/http/services/campaigns/direct/DirectCampaignService'
import { transformStoreToSettings } from '@helpers/directCampaignSettingsTransformer'
import { CloseRounded } from '@mui/icons-material'
import { Button, IconButton, Snackbar } from '@mui/material'
import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { useDirectCampaignSettingsStore } from '../../store/directCampaignSettingsStore'

type DirectCampaignSettingsWrapperProps = {
	campaignId: number | null
} & PropsWithChildren

export default function DirectCampaignSettingsWrapper({
	campaignId,
	children,
}: DirectCampaignSettingsWrapperProps) {
	const resetSettings = useDirectCampaignSettingsStore(s => s.resetSettings)
	const setSettings = useDirectCampaignSettingsStore(s => s.setSettings)
	const stateCampaignId = useDirectCampaignSettingsStore(s => s.campaignId)
	const getStore = useDirectCampaignSettingsStore(s => s.getStore)
	const setStore = useDirectCampaignSettingsStore(s => s.setStore)
	const [cachedStore, setCachedStore] = useState<ReturnType<typeof getStore> | null>(null)

	const localStorageCacheName = (id: number | null) => 'directCampaign-' + id

	const restoreCache = useCallback(() => {
		const store = getStore()
		let cachedStore: ReturnType<typeof getStore> | null = null

		try {
			const localStore = localStorage.getItem(localStorageCacheName(store.campaignId))
			if (localStore) {
				cachedStore = JSON.parse(localStore)
			}
		} catch (err) {
			console.error('Ошибка при чтении кэша:', err)
		}

		if (!cachedStore) return
		const currentSettings = transformStoreToSettings(store)
		const cachedSettings = transformStoreToSettings(cachedStore)
		if (JSON.stringify(currentSettings) === JSON.stringify(cachedSettings)) {
			return setCachedStore(null)
		}
		setCachedStore(cachedStore)
	}, [getStore])

	useEffect(() => {
		const loadSettings = async () => {
			if (campaignId === null) {
				resetSettings()
				restoreCache()
				return
			}
			if (campaignId === stateCampaignId) {
				restoreCache()
			}
			const { data } = await DirectCampaignService.getDirectCampaign(campaignId)
			setSettings(campaignId, data)
			restoreCache()
		}
		loadSettings()
	}, [stateCampaignId, campaignId, resetSettings, setSettings, restoreCache])

	useEffect(() => {
		const saveStoreToLocalStorage = () => {
			try {
				localStorage.setItem(
					localStorageCacheName(getStore().campaignId),
					JSON.stringify(getStore())
				)
			} catch (err) {
				console.error('Ошибка при сохранении кэша:', err)
			}
		}
		window.addEventListener('beforeunload', saveStoreToLocalStorage)
		return () => {
			saveStoreToLocalStorage()
			window.removeEventListener('beforeunload', saveStoreToLocalStorage)
		}
	}, [getStore])

	return (
		<>
			{campaignId === stateCampaignId && (
				<>
					<Snackbar
						open={Boolean(cachedStore && cachedStore.campaignId === campaignId)}
						autoHideDuration={6000}
						onClose={() => setCachedStore(null)}
						message='У вас остались несохраненные данные'
						action={
							<>
								<Button
									color='secondary'
									size='small'
									onClick={() => {
										if (cachedStore) {
											setStore(cachedStore)
										}
										setCachedStore(null)
									}}
								>
									Восстановить
								</Button>
								<IconButton
									size='small'
									aria-label='close'
									color='inherit'
									onClick={() => setCachedStore(null)}
								>
									<CloseRounded fontSize='small' />
								</IconButton>
							</>
						}
					/>
					{children}
				</>
			)}
		</>
	)
}
