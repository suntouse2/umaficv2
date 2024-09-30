import DirectCampaignService from '@api/http/services/campaigns/DirectCampaignService';
import SettingsCheckService from '@api/http/services/campaigns/SettingsCheckService';
import GeoService from '@api/http/services/GeoService';
import DirectService from '@api/http/services/chat/DirectService';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export function useFetchDirectCampaigns() {
  return useInfiniteQuery({
    queryKey: ['get-direct-campaigns'],
    queryFn: ({ pageParam }) => DirectCampaignService.getDirectCampaigns(pageParam),
    staleTime: 60 * 1000 * 2,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.length == 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
}

export function useToggleDirectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['toggle-campaign'],
    mutationFn: ({ id, campaignState }: { id: number; campaignState: boolean }) => (campaignState ? DirectCampaignService.stopCampaign(id) : DirectCampaignService.startCampaign(id)),
    onMutate: ({ id, campaignState }) => {
      queryClient.setQueryData(['get-direct-campaigns'], (data: InfiniteData<AxiosResponse<TDirectCampaignResponse[]>>) => ({
        ...data,
        pages: [
          ...data.pages.map((item) => {
            return { ...item, data: item.data.map((item) => (item.id == id ? { ...item, is_active: !campaignState } : item)) };
          }),
        ],
      }));
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
    onSuccess: () => {
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
    mutationFn: ({ id, data }: { id: number; data: TDirectCampaignSettings }) => DirectCampaignService.editDirectCampaign(id, data),
    gcTime: 0,
    onSuccess: () => {
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
    onMutate: ({ id }) => {
      queryClient.setQueryData(['get-direct-campaigns'], (data: InfiniteData<AxiosResponse<TDirectCampaignResponse[]>>) => ({
        ...data,
        pages: [
          ...data.pages.map((item) => {
            return { ...item, data: item.data.filter((item) => item.id !== id) };
          }),
        ],
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['get-direct-campaigns'] });
    },
  });
}

export function useFetchChatDirects(campaign_id: number, filter?: { is_open?: boolean; is_favorite?: boolean }) {
  return useInfiniteQuery({
    queryKey: ['directs', campaign_id, filter],
    queryFn: ({ queryKey, pageParam }) => {
      const campaign_id = queryKey[1] as number;
      return DirectService.getDirects(campaign_id, pageParam, filter);
    },
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.length == 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
}

export function useFetchDirect(id: number) {
  return useQuery({
    queryKey: ['direct', id],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] as number;
      return DirectService.getDirect(id);
    },
    select: (data) => {
      return data.data;
    },
    staleTime: Infinity,
  });
}

export function useUpdateDirect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['setDialogOpened'],
    mutationFn: ({ direct_id, data }: { campaign_id: number; direct_id: number; data: TChatDirectStatusUpdate }) => DirectService.updateDirect(direct_id, data),
    onSuccess: (_, { campaign_id }) => {
      queryClient.invalidateQueries({ queryKey: ['directs', campaign_id] });
    },
  });
}

export function useFetchDirectMessages(direct_id: number) {
  return useInfiniteQuery({
    queryKey: ['direct-messages', direct_id],
    queryFn: ({ queryKey, pageParam }) => {
      const id = queryKey[1] as number;
      return DirectService.getDirectMessages(id, pageParam);
    },
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.length == 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return { pages: [...data.pages.map((item) => [...item.data].reverse())].reverse(), pageParams: [...data.pageParams].reverse() };
    },
  });
}

export function useSetLastMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['setLastMessageRead'],
    mutationFn: ({ direct_id, message_id }: { campaign_id: number; direct_id: number; message_id: number }) => DirectService.readMessage(direct_id, message_id),
    onSuccess: (_, { campaign_id }) => {
      queryClient.invalidateQueries({ queryKey: ['directs', campaign_id] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: ({ direct_id, msg }: { direct_id: number; msg: TChatSendMessage; campaign_id: number }) => DirectService.sendMessage(direct_id, msg),
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          toast.error('Ошибка отправки. Возможно кампания не запущена или была запущена недавно.');
        }
      }
    },
    onSuccess: (_data, { direct_id, msg }) => {
      // queryClient.setQueryData(['directs', campaign_id], (data: InfiniteData<AxiosResponse<TChatDirectsResponse>>) => {
      //   const newPages = data.pages.map((page) => ({
      //     ...page,
      //     data: [...page.data],
      //   }));
      //   const index = newPages.findIndex((page) => page.data.some((direct) => direct.id == direct_id));
      //   if (index !== -1) {
      //     newPages[index].data.map((direct) =>
      //       direct.id == direct_id
      //         ? {
      //             ...direct,
      //             last_message: {
      //               ...direct.last_message,
      //               id: direct.last_message.id + 999,
      //               content: msg,
      //               is_self: true,
      //               catch_slug: _data.data.catch_slug,
      //             },
      //           }
      //         : direct
      //     );
      //   }
      // });
      queryClient.setQueryData(['direct-messages', direct_id], (data: InfiniteData<AxiosResponse<TChatDirectMessagesResponse>>) => {
        const newPages = data.pages.map((page) => ({
          ...page,
          data: [...page.data],
        }));
        newPages[0].data.unshift({
          ...newPages[0].data[0],
          id: newPages[0].data[0].id + 999,
          content: msg['content'],
          is_self: true,
          catch_slug: _data.data.catch_slug,
        });
        return {
          ...data,
          pages: newPages,
        };
      });
    },
  });
}
