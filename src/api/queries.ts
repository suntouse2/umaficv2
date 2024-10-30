import DirectCampaignService from '@api/http/services/campaigns/DirectCampaignService';
import SettingsCheckService from '@api/http/services/campaigns/SettingsCheckService';
import GeoService from '@api/http/services/GeoService';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function useFetchDirectCampaigns() {
  return useInfiniteQuery({
    queryKey: ['get-direct-campaigns'],
    queryFn: ({ pageParam }) => DirectCampaignService.getDirectCampaigns(pageParam),
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.length == 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    refetchInterval: (data) => {
      if (!data) return false;
      if (!data.state.data) return false;
      const hasPendingCampaigns = data.state.data.pages.some((page) => page.data.some((campaign) => ['preparing', 'pending'].includes(campaign.state)));
      return hasPendingCampaigns ? 2000 : 60 * 1000;
    },
  });
}

export function useToggleDirectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['toggle-campaign'],
    mutationFn: ({ id, campaignState }: { id: number; campaignState: TDirectCampaign['state'] }) => (campaignState == 'active' ? DirectCampaignService.stopCampaign(id) : DirectCampaignService.startCampaign(id)),
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.data.detail && typeof e.response?.data.detail == 'string') {
          toast.error(e.response?.data.detail);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['get-direct-campaigns'] });
    },
  });
}
export function useFetchLanguages() {
  return useQuery({
    queryKey: ['geo-languages'],
    queryFn: () => GeoService.getLanguages(),
    select: (data) => data.data,
    staleTime: Infinity,
  });
}

export function useFetchCountries(languages: string[]) {
  return useQuery({
    queryKey: ['geo-countries', ...languages],
    queryFn: () => GeoService.getCountries(languages),
    select: (data) => data.data,
    staleTime: Infinity,
  });
}

export function useFetchRegions(countries: string[]) {
  return useQuery({
    queryKey: ['geo-regions', ...countries],
    queryFn: () => GeoService.getRegions(countries),
    select: (data) => data.data,
    staleTime: Infinity,
  });
}

export function useFetchCities(regions: string[]) {
  return useQuery({
    queryKey: ['geo-cities', ...regions],
    queryFn: () => GeoService.getCities(regions),
    select: (data) => data.data,
    staleTime: Infinity,
  });
}

export function useFetchSettingsCheckMsg(target: TCampaignSettingsTarget) {
  return useInfiniteQuery({
    queryKey: ['check-settings-msg', target.search.include, target.geo],
    queryFn: ({ pageParam }) => SettingsCheckService.getMessages(target, pageParam),
    staleTime: 60 * 1000 * 3,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.length == 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
}
export function useFetchSettingsCheckStats(target: TCampaignSettingsTarget) {
  return useQuery({
    queryKey: ['check-settings-stats', target],
    queryFn: () => SettingsCheckService.getStatistic(target),
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
}

export function useCreateDirectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createCampaign'],
    mutationFn: ({ data }: { data: TDirectCampaignSettings }) => DirectCampaignService.createDirectCampaign(data),
    gcTime: 0,
    onError: (error) => {
      if (error instanceof AxiosError) {
        const status = error.status;
        return toast.error(`${status}: Не удалось создать кампанию`);
      }
      toast.error('Не удалось создать кампанию');
    },
    onSuccess: () => {
      toast.success('Кампания создана');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['get-direct-campaigns'] });
      }, 2000);
    },
  });
}

export function useEditDirectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['editCampaign'],
    mutationFn: ({ id, data }: { id: number; data: TPartialDirectCampaignSettings }) => DirectCampaignService.editDirectCampaign(id, data),
    gcTime: 0,
    onError: (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        const status = error.status;
        return toast.error(`${status}: Не удалось изменить кампанию`);
      }
      toast.error('Не удалось изменить кампанию');
    },
    onSuccess: () => {
      toast.success('Кампания изменена');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['get-direct-campaigns'] });
      }, 2000);
    },
  });
}

export function useDeleteDirectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteCampaign'],
    mutationFn: ({ id }: { id: number }) => DirectCampaignService.deleteDirectCampaign(id),
    gcTime: 0,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['get-direct-campaigns'] });
    },
    onSuccess: () => {
      toast.success('Кампания удалена');
    },
    onError: () => {
      toast.error('Не удалось удалить кампанию');
    },
  });
}
