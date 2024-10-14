import ChatScreen from '@components/chat/ChatScreen';
import PageLayout from '@components/wrappers/layouts/PageLayout';
import PageError from '@pages/pageError';

export const routes = [
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <PageError />,
    children: [
      {
        name: 'dashboard',
        path: '',
        async lazy() {
          const Dashboard = await import('@pages/pageDashboard');
          return { Component: Dashboard.default };
        },
      },
      {
        name: 'payment page',
        path: 'balance',
        async lazy() {
          const Balance = await import('@pages/pageBalance');
          return { Component: Balance.default };
        },
      },
      {
        name: 'direct campaign',
        path: 'campaigns/direct',
        async lazy() {
          const Campaigns = await import('@pages/pageDirectCampaign');
          return { Component: Campaigns.default };
        },
      },
      {
        name: 'direct campaign create',
        path: 'campaigns/direct/create',
        async lazy() {
          const ComposeDirectCampaign = await import('@pages/pageComposeDirectCampaign');
          return { Component: ComposeDirectCampaign.default };
        },
      },
      {
        name: 'direct campaign edit',
        path: 'campaigns/direct/edit',
        async lazy() {
          const ComposeDirectCampaign = await import('@pages/pageComposeDirectCampaign');
          return { Component: ComposeDirectCampaign.default };
        },
      },
      {
        name: 'chat',
        path: 'chat/:campaignId',
        children: [
          {
            name: 'chat current',
            path: ':directId',
            element: <ChatScreen />,
          },
        ],
        async lazy() {
          const Chat = await import('@pages/pageChat');
          return { Component: Chat.default };
        },
      },
    ],
  },
];
