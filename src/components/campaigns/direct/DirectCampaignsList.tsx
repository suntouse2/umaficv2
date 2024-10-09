import { useFetchDirectCampaigns } from '@api/queries';
import DirectCampaignCard from '@components/campaigns/direct/DirectCampaignCard';
import { CircularProgress } from '@mui/material';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default memo(function DirectCampaignsList() {
  const { data, isPending, fetchNextPage } = useFetchDirectCampaigns();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  return (
    <div className='mt-5 p-0 md:p-4 flex flex-col gap-5'>
      {data && data.pages.map((campaigns) => campaigns.data.map((campaign) => <DirectCampaignCard key={campaign.id} campaign={campaign} />))}
      {isPending && <CircularProgress color='inherit' />}
      <div ref={ref}></div>
    </div>
  );
});
