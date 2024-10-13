import { useFetchDirectCampaigns } from '@api/queries';
import DirectCampaignCard from '@components/campaigns/direct/DirectCampaignCard';
import { CircularProgress } from '@mui/material';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default memo(function DirectCampaignsList() {
  const { data, isPending, fetchNextPage } = useFetchDirectCampaigns();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  return (
    <div className='flex flex-col p-0 pt-2 md:p-4 md:pt-3 sm:grid grid-cols-auto-fit-450 gap-2'>
      {data && data.pages.map((campaigns) => campaigns.data.map((campaign) => <DirectCampaignCard key={campaign.id} campaign={campaign} />))}
      {isPending && <CircularProgress color='inherit' />}
      {data && <div ref={ref}></div>}
    </div>
  );
});
