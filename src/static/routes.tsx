import PageDashboard from '@pages/pageDashboard';

export const routes = [
  {
    name: '',
    path: '/',
    element: <PageDashboard />,
  },
  {
    name: 'payment page',
    path: '/balance',
    async lazy() {
      const Balance = await import('@pages/pageBalance');
      return { Component: Balance.default };
    },
  },
  {
    name: 'direct campaign',
    path: '/campaigns/direct',
    async lazy() {
      const Campaigns = await import('@pages/pageDirectCampaign');
      return { Component: Campaigns.default };
    },
  },
  {
    name: 'direct campaign create',
    path: '/campaigns/direct/create',
    async lazy() {
      const ComposeDirectCampaign = await import('@pages/pageComposeDirectCampaign');
      return { Component: ComposeDirectCampaign.default };
    },
  },
  {
    name: 'direct campaign edit',
    path: '/campaigns/direct/edit',
    async lazy() {
      const ComposeDirectCampaign = await import('@pages/pageComposeDirectCampaign');
      return { Component: ComposeDirectCampaign.default };
    },
  },
  {
    name: 'chat',
    path: '/chat/',
    async lazy() {
      const Chat = await import('@pages/pageChat');
      return { Component: Chat.default };
    },
  },
];
