import { useFetchDirectCampaignSettingsStats } from '@api/queries'
import Input from '@components/common/Input'
import Bubble from '@components/ui/Bubble'
import formatBalance from '@helpers/formatBalance'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'

export default function DirectCampaignLaunchSettings() {
	const name = useDirectCampaignSettingsStore(state => state.settings.name)
	const budget_limit = useDirectCampaignSettingsStore(
		state => state.settings.budget_limit
	)
	const setName = useDirectCampaignSettingsStore(state => state.setName)
	const setBudgetLimit = useDirectCampaignSettingsStore(state => state.setBudgetLimit)

	const [geo, keywords] = useDirectCampaignSettingsStore(
		useShallow(state => [state.settings.geo, state.settings.keywords])
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
	const recommendBudget = statsQuery.data?.recommended_daily_budget_limit
	return (
		<Bubble className='mt-4 relative'>
			<h2 className='text-lg flex gap-2 font-bold'>Запуск</h2>
			<p className='text-sm mt-2'>
				Придумайте название кампании и укажите бюджет для нее.
			</p>
			<Input
				className='mt-4'
				placeholder='Название кампании'
				value={name}
				onChange={setName}
			/>
			<Input
				placeholder='Бюджет кампании'
				className='mt-2'
				minNumber={24}
				value={budget_limit}
				onChange={setBudgetLimit}
				onlyDigits
			/>
			<b className='mt-2 text-sm'>
				Рекомендуемый суточный бюджет по статистике:{' '}
				<span className='text-secondary'>{formatBalance(recommendBudget)}</span>
			</b>
		</Bubble>
	)
}
