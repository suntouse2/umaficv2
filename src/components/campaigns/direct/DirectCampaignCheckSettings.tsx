import {
	useFetchDirectCampaignSettingsMessages,
	useFetchDirectCampaignSettingsStats,
} from '@api/queries'
import Lid from '@components/Lid'
import Bubble from '@components/ui/Bubble'
import formatBalance from '@helpers/formatBalance'
import { Button, Dialog, LinearProgress, Tab, Tabs } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useShallow } from 'zustand/shallow'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'

export default function DirectCampaignCheckSettings() {
	const [dialog, setDialog] = useState<boolean>(false)
	const [tabIndex, setTabIndex] = useState<number>(0)

	const [geo, keywords, setKeyword] = useDirectCampaignSettingsStore(
		useShallow(state => [state.settings.geo, state.settings.keywords, state.setKeyword])
	)
	const transposedTarget = useMemo(() => {
		return {
			geo,
			search: {
				include: keywords.include.map(kw => kw.value),
				exclude: keywords.exclude.map(kw => kw.value),
			},
		}
	}, [geo, keywords.include, keywords.exclude])

	const statsQuery = useFetchDirectCampaignSettingsStats(transposedTarget)

	const msgQuery = useFetchDirectCampaignSettingsMessages(transposedTarget, tabIndex)
	const fetchNextMessages = msgQuery.fetchNextPage
	const messages = msgQuery.data ? msgQuery.data.pages.flatMap(msg => msg.data) : []
	const isMessagesFetching = msgQuery.isPending

	const noKeywords = keywords.include.length == 0

	const handleManageKeywords = (type: 'include' | 'exclude', keyword: string) => {
		const filter = keyword.trim().toLowerCase()
		if (filter && !keywords[type].some(key => key.value === filter)) {
			setKeyword(type, [...keywords[type], { id: nanoid(), value: keyword }])
			return type === 'include' && setTabIndex(keywords.include.length)
		}
	}
	return (
		<Bubble className='relative mt-4'>
			<p className='text-sm'>
				Перед запуском Umafic Таргет рекомендуем проверить настройки поисковых фраз.{' '}
				<br />
				<br /> Для этого используем кнопку "Проверить Настройки".
				<br />
				<br /> При этом система в режиме реального времени покажет, на какие сообщения
				будет реагировать. Благодаря этому инструменту вы сможете решить, какие фразы
				нужно добавить или исключить из "Поисковых фраз", а также "Минус-фраз". <br />
				<br /> Для добавления, нажмите на слово в найденном сообщении, при необходимости
				измените его и добавьте в "Поисковые фразы" или "Минус-фразы"
			</p>
			<Button
				onClick={() => setDialog(true)}
				variant='outlined'
				disabled={noKeywords}
				color='secondary'
				className='!rounded-full !mt-4'
			>
				Проверить настройки
			</Button>
			{noKeywords && (
				<p className='mt-2 text-sm text-negative'>
					Чтобы проверить настройки, добавьте минимум одну ключевую фразу.
				</p>
			)}
			<Dialog
				PaperProps={{
					className: 'w-full h-full',
				}}
				open={dialog}
				onClose={() => setDialog(false)}
			>
				<article className='py-2 flex flex-col h-full overflow-hidden'>
					{!statsQuery.data && <LinearProgress />}
					<AnimatePresence>
						{statsQuery.data && (
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
								className='p-2'
							>
								<p className='text-lg'>Всего сообщений: {statsQuery.data?.messages}</p>
								<p className='text-lg'>
									Всего потенциальных клиентов: {statsQuery.data.unique_users}
								</p>
								<p className='text-lg'>
									Рекомендуемый суточный бюджет:{' '}
									{formatBalance(statsQuery.data.recommended_daily_budget_limit)}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
					<Tabs
						variant='scrollable'
						scrollButtons={false}
						allowScrollButtonsMobile
						indicatorColor='secondary'
						textColor='secondary'
						value={tabIndex}
						onChange={(_e, v) => setTabIndex(v)}
					>
						{transposedTarget.search.include.map((item, index) => (
							<Tab label={item} key={index} />
						))}
					</Tabs>
					{messages && !isMessagesFetching && (
						<Virtuoso
							className='chatScroll'
							style={{ height: '100%', width: '100%' }}
							data={messages}
							itemContent={(_, message) => (
								<Lid
									message={message}
									key={message.id}
									onKeywordInclude={v => handleManageKeywords('include', v)}
									onKeywordExclude={v => handleManageKeywords('exclude', v)}
								/>
							)}
							endReached={() => fetchNextMessages()}
							increaseViewportBy={{ top: 0, bottom: 1000 }}
						/>
					)}
				</article>
			</Dialog>
		</Bubble>
	)
}
