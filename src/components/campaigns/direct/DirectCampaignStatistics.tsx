import formatBalance from '@helpers/formatBalance'

type DirectCampaignStatisticsProps = {
	statistics: TDirectCampaignNumericStatistics
}
export default function DirectCampaignStatistics({
	statistics,
}: DirectCampaignStatisticsProps) {
	const renderPlus = (title: string, data: string | number) => (
		<span
			title={title}
			className='ml-1 bg-positive whitespace-nowrap px-1 text-sm rounded-sm bg-opacity-20'
		>
			+ {data}
		</span>
	)
	const calculateAverage = (
		spending: string,
		count: number
	): string | undefined | '―' => {
		if (count < 1) return '―'
		const average = parseFloat(spending) / count
		return formatBalance(average.toFixed(0))
	}

	return (
		<div>
			<div className='flex flex-col gap-2'>
				<h2 className='font-bold'>Сообщения</h2>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Отправленных сообщений (первое касание)</dt>
					<dd className='text-sm flex items-center'>
						{statistics.directs}
						{renderPlus('Отправленных в сутки', statistics.directs_by_day)}
					</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Состоялось диалогов (второе касание)</dt>
					<dd className='text-sm flex items-center'>
						{statistics.directs}
						{renderPlus('Входящих в сутки', statistics.directs_interacted_by_day)}
					</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Непрочитанных входящих сообщений</dt>
					<dd className='text-sm'>{statistics.incoming_messages_unread}</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Избранных диалогов</dt>
					<dd className='text-sm'>{statistics.directs_favorite}</dd>
				</dl>
				<h2 className='font-bold'>Финансы</h2>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Общий расход</dt>
					<dd className='text-sm'>
						{formatBalance(statistics.spending)}
						{renderPlus('Входящих в сутки', statistics.spending_by_day)}
					</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Общий возврат средств</dt>
					<dd className='text-sm'>
						{formatBalance(statistics.repayment)}
						{renderPlus('Входящих в сутки', statistics.repayment_by_day)}
					</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Средняя цена одного избранного/лида</dt>
					<dd className='text-sm'>
						{calculateAverage(statistics.spending, statistics.directs_favorite)}
					</dd>
				</dl>
				<dl className='flex items-center justify-between'>
					<dt className='text-sm'>Средняя цена одного диалога</dt>
					<dd className='text-sm'>
						{calculateAverage(statistics.spending, statistics.directs_interacted)}
					</dd>
				</dl>
			</div>
		</div>
	)
}
