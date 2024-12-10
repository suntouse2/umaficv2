import GeoService from '@api/http/services/GeoService'
import {
	keepPreviousData,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import DirectCampaignService from './http/services/campaigns/direct/DirectCampaignService'

export function useFetchDirectCampaigns() {
	return useInfiniteQuery({
		queryKey: ['fetch-direct-campaigns'],
		queryFn: ({ pageParam }) => DirectCampaignService.getDirectCampaigns(pageParam),
		staleTime: Infinity,
		initialPageParam: 1,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (lastPage.data.length == 0) {
				return undefined
			}
			return lastPageParam + 1
		},
		refetchInterval: data => {
			if (!data) return false
			if (!data.state.data) return false
			const hasPendingCampaigns = data.state.data.pages.some(page =>
				page.data.some(campaign => ['preparing', 'pending'].includes(campaign.state))
			)
			return hasPendingCampaigns ? 2000 : 60 * 1000
		},
	})
}

export function useToggleDirectCampaign() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, action }: { id: number; action: 'start' | 'stop' }) =>
			action == 'start'
				? DirectCampaignService.startCampaign(id)
				: DirectCampaignService.stopCampaign(id),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['fetch-direct-campaigns'] })
		},
	})
}
export function useCreateDirectCampaign() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ settings }: { settings: TDirectCampaignSettings }) =>
			DirectCampaignService.createDirectCampaign(settings),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['fetch-direct-campaigns'] })
		},
	})
}
export function useEditDirectCampaign() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			settings,
		}: {
			id: number
			settings: Partial<TDirectCampaignSettings>
		}) => DirectCampaignService.editDirectCampaign(id, settings),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['fetch-direct-campaigns'] })
		},
	})
}

export function useDeleteDirectCampaign() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-direct-campaign'],
		mutationFn: ({ id }: { id: number }) =>
			DirectCampaignService.deleteDirectCampaign(id),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['fetch-direct-campaigns'] })
		},
	})
}

export function useFetchDirectCampaignSettingsMessages(
	target: TDirectCampaignSettingsTarget,
	keywordIndex?: number
) {
	return useInfiniteQuery({
		queryKey: ['check-settings-msg', target, keywordIndex],
		queryFn: ({ pageParam }) =>
			DirectCampaignService.getMessages(
				keywordIndex === undefined
					? target
					: {
							...target,
							search: {
								...target.search,
								include: [target.search.include[keywordIndex]],
							},
					  },
				pageParam
			),
		staleTime: 60 * 1000 * 3,
		placeholderData: keepPreviousData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (lastPage.data.length == 0) {
				return undefined
			}
			return lastPageParam + 1
		},
		retry: false,
	})
}
export function useFetchDirectCampaignSettingsStats(
	target: TDirectCampaignSettingsTarget
) {
	return useQuery({
		queryKey: ['check-settings-stats', target],
		queryFn: () => DirectCampaignService.getStatistic(target),
		staleTime: 60 * 1000 * 5,
		select: data => data.data,
		retry: false,
	})
}
export function useFetchGeoLanguages() {
	return useQuery({
		queryKey: ['geo-languages'],
		queryFn: () => GeoService.getLanguages(),
		select: data => new Map(Object.entries(data.data)),
		staleTime: Infinity,
	})
}

export function useFetchGeoCountries(languages?: string[]) {
	return useQuery({
		queryKey: ['geo-countries', languages],
		queryFn: () => GeoService.getCountries(languages),
		select: data => new Map(Object.entries(data.data)),
		staleTime: Infinity,
	})
}

export function useFetchGeoRegions(countries?: string[]) {
	return useQuery({
		queryKey: ['geo-regions', countries],
		queryFn: () => GeoService.getRegions(countries),
		select: data => new Map(Object.entries(data.data)),
		staleTime: Infinity,
	})
}

export function useFetchGeoCities(regions?: string[]) {
	return useQuery({
		queryKey: ['geo-cities', regions],
		queryFn: () => GeoService.getCities(regions),
		select: data => new Map(Object.entries(data.data)),
		staleTime: Infinity,
	})
}
