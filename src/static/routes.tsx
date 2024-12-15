/* eslint-disable react-refresh/only-export-components */
import AuthWrapper from '@components/wrappers/AuthWrapper'
import MainLayout from '@components/wrappers/layouts/MainLayout'
import { CircularProgress } from '@mui/material'
import PageAddChat from '@pages/pageAddChat'
import PageChat from '@pages/pageChat'
import PageDashboard from '@pages/pageDashboard'
import PageDirectCampaigns from '@pages/pageDirectCampaigns'
import PageUpsertDirectCampaign from '@pages/pageUpsertDirectCampaign'
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
