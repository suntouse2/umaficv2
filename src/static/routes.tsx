/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import PageError from '@pages/pageError';
import PageLayout from '@components/wrappers/layouts/PageLayout';

const NotFound = lazy(() => import('@pages/page404'));
const Dashboard = lazy(() => import('@pages/pageDashboard'));
const Balance = lazy(() => import('@pages/pageBalance'));
const DirectCampaign = lazy(() => import('@pages/pageDirectCampaign'));
const ComposeDirectCampaign = lazy(() => import('@pages/pageComposeDirectCampaign'));
const Chat = lazy(() => import('@pages/pageChat'));

export const routes = [
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <PageError />,
    children: [
      {
        name: 'dashboard',
        path: '',
        element: <Dashboard />,
      },
      {
        name: 'payment page',
        path: 'balance',
        element: <Balance />,
      },
      {
        name: 'direct campaign',
        path: 'campaigns/direct',
        element: <DirectCampaign />,
      },
      {
        name: 'direct campaign create',
        path: 'campaigns/direct/create',
        element: <ComposeDirectCampaign />,
      },
      {
        name: 'direct campaign edit',
        path: 'campaigns/direct/edit',
        element: <ComposeDirectCampaign />,
      },
      {
        name: 'chat',
        path: 'chat/:campaignId/:directId?',
        element: <Chat />,
      },
    ],
  },
];
