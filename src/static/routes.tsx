/* eslint-disable react-refresh/only-export-components */
import MainLayout from '@components/layouts/MainLayout'
import AuthWrapper from '@components/wrappers/AuthWrapper'
import { CircularProgress } from '@mui/material'
import PageAddChat from '@pages/pageAddChat'
import PageChat from '@pages/pageChat'
import PageDashboard from '@pages/pageDashboard'
import PageDirectCampaigns from '@pages/pageDirectCampaigns'
import PagePrCampaigns from '@pages/pagePrCampaigns'
import PageUpsertDirectCampaign from '@pages/pageUpsertDirectCampaign'
import PageUpsertPrCampaign from '@pages/pageUpsertPrCampaign'
import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const PageError = lazy(() => import('@pages/pageError'))
const PageNotFound = lazy(() => import('@pages/pageNotFound'))
const PageAntiSpam = lazy(() => import('@pages/pageAntiSpam'))
export const routes = [
	{
		path: '*',
		element: (
			<Suspense>
				<PageNotFound />
			</Suspense>
		),
	},
	{
		path: '/',
		element: (
			<>
				<AuthWrapper>
					<MainLayout>
						<Outlet />
					</MainLayout>
				</AuthWrapper>
			</>
		),
		errorElement: (
			<Suspense>
				<PageError />
			</Suspense>
		),
		children: [
			{
				name: 'dashboard',
				path: '',
				element: <PageDashboard />,
			},
			{
				name: 'chat',
				path: 'chat/:campaignId/:directId?',
				element: <PageChat />,
			},
			{
				name: 'direct campaign',
				path: 'campaigns/direct',
				element: <PageDirectCampaigns />,
			},
			{
				name: 'pr campaign',
				path: 'campaigns/pr',
				element: <PagePrCampaigns />,
			},
			{
				name: 'direct campaign create',
				path: 'campaigns/direct/create',
				element: <PageUpsertDirectCampaign />,
			},
			{
				name: 'direct campaign edit',
				path: 'campaigns/direct/edit/:id',
				element: <PageUpsertDirectCampaign />,
			},
			{
				name: 'pr campaign create',
				path: 'campaigns/pr/create',
				element: <PageUpsertPrCampaign />,
			},
			{
				name: 'pr campaign edit',
				path: 'campaigns/pr/edit/:id',
				element: <PageUpsertPrCampaign />,
			},
			{
				name: 'antispam',
				path: 'antispam',
				element: (
					<Suspense fallback={<CircularProgress />}>
						<PageAntiSpam />
					</Suspense>
				),
			},
			{
				name: 'Add Chat',
				path: 'addChat',
				element: <PageAddChat />,
			},
		],
	},
]
