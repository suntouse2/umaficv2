import DirectCampaignService from '@api/http/services/campaigns/direct/DirectCampaignService'
import { transformStoreToSettings } from '@helpers/directCampaignSettingsTransformer'
import { CloseRounded } from '@mui/icons-material'
import { Button, IconButton, Snackbar } from '@mui/material'
import { isEqual } from 'lodash'
import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { useDirectCampaignSettingsStore } from '../../store/directCampaignSettingsStore'

type DirectCampaignSettingsWrapperProps = {
	campaignId: number | null
} & PropsWithChildren

export default function DirectCampaignSettingsWrapper({
	campaignId,
	children,
}: DirectCampaignSettingsWrapperProps) {
	const resetSettings = useDirectCampaignSettingsStore(state => state.resetSettings)
	const setSettings = useDirectCampaignSettingsStore(state => state.setSettings)
	const currentCampaignId = useDirectCampaignSettingsStore(state => state.campaignId)
	const getStore = useDirectCampaignSettingsStore(state => state.getStore)
	const setStore = useDirectCampaignSettingsStore(state => state.setStore)
	const [cachedStore, setCachedStore] = useState<ReturnType<typeof getStore> | null>(null)
	const localStorageCacheName = (id: number | null) => 'directCampaign-' + id
	const [loading, setLoading] = useState<boolean>(true)
	const fetchSettings = useCallback(
		async (campaignId: number) => {
			const { data } = await DirectCampaignService.getDirectCampaign(campaignId)
			setSettings(campaignId, data)
		},
		[setSettings]
	)
	const saveStoreToLocalStorage = useCallback(() => {
		localStorage.setItem(
			localStorageCacheName(getStore().campaignId),
			JSON.stringify(getStore())
		)
	}, [getStore])

	const restoreLocalSettings = useCallback(() => {
		const store = getStore()
		let cachedStore: ReturnType<typeof getStore> | null = null
		const localStore = localStorage.getItem(localStorageCacheName(store.campaignId))
		if (!localStore) return
		cachedStore = JSON.parse(localStore)
		if (!cachedStore) return

		const currentSettings = transformStoreToSettings(store)
		const cachedSettings = transformStoreToSettings(cachedStore)

		if (isEqual(currentSettings, cachedSettings)) {
			localStorage.removeItem(localStorageCacheName(store.campaignId))
			return setCachedStore(null)
		}
		setCachedStore(cachedStore)
	}, [getStore])

	useEffect(() => {
		const load = async () => {
			if (campaignId == null) resetSettings()
			else if (campaignId !== currentCampaignId) await fetchSettings(campaignId)
			setLoading(false)
			restoreLocalSettings()
		}
		load()
	}, [
		campaignId,
		currentCampaignId,
		fetchSettings,
		resetSettings,
		restoreLocalSettings,
		setSettings,
	])

	useEffect(() => {
		window.addEventListener('beforeunload', saveStoreToLocalStorage)
		return () => {
			saveStoreToLocalStorage()
			window.removeEventListener('beforeunload', saveStoreToLocalStorage)
		}
	}, [getStore, saveStoreToLocalStorage])

	if (campaignId !== currentCampaignId || loading) return <></>
	return (
		<article>
			<Snackbar
				open={Boolean(cachedStore && cachedStore.campaignId === campaignId)}
				message='У вас остались несохраненные данные'
				action={
					<>
						<Button
							color='secondary'
							size='small'
							onClick={() => {
								if (cachedStore) setStore(cachedStore)
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
		</article>
	)
}
