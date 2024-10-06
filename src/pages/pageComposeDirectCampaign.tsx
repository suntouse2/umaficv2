import DirectCampaignService from '@api/http/services/campaigns/DirectCampaignService';
import DirectCampaignUpsertForm from '@components/campaigns/direct/DirectCampaignUpsertForm';
import Container from '@components/wrappers/layouts/Container';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ComposeDirectCampaign() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { id } = location.state || {};
  const [data, setData] = useState<
    | (TDirectCampaignSettings & {
        temporary: {
          first_message: { messages: TFunnelMessage[] }[];
          any_message: { messages: TFunnelMessage[] }[];
        };
      })
    | null
  >(null);

  const fetchCampaign = useCallback(async (id: number) => {
    const { data } = await DirectCampaignService.getDirectCampaign(id);
    const first_message: { messages: TFunnelMessage[] }[] = [{ messages: [] }];
    const any_message: { messages: TFunnelMessage[] }[] = [{ messages: [] }];
    if (data.settings.auto_reply.funnel.funnel_type == 'keyword') {
      first_message[0]['messages'] = data.settings.auto_reply.funnel.order[0]?.messages ?? [];
      any_message[0]['messages'] = data.settings.auto_reply.funnel.order[1]?.messages ?? [];
      data.settings.auto_reply.funnel.order = [];
    }
    setData({
      ...data,
      temporary: {
        first_message,
        any_message,
      },
    });
  }, []);

  useEffect(() => {
    if (path.split('/')[3] === 'edit' && !id) {
      return navigate('/campaigns/direct');
    }
    if (path.split('/')[3] === 'edit' && id) fetchCampaign(id);
  }, [fetchCampaign, id, navigate, path]);

  return (
    <Container>
      {path.split('/')[3] === 'edit' && data && <DirectCampaignUpsertForm id={id} data={data} />}
      {path.split('/')[3] === 'create' && <DirectCampaignUpsertForm />}
    </Container>
  );
}
