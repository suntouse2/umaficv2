import Funnely from '@components/Funnely'
import {
	anyMessageTip,
	firstMessageTip,
	keywordMessageTip,
	orderMessageTip,
} from '@components/helpers/directCampaignFormTips'
import Bubble from '@components/ui/Bubble'
import TipBox from '@components/ui/TipBox'
import containsLink from '@helpers/containsLink'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useShallow } from 'zustand/shallow'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'

export default function DirectCampaignFunnelSettings() {
	const [messages, funnelType, setFunnel] = useDirectCampaignSettingsStore(
		useShallow(state => [
			state.settings.auto_reply.funnel.messages,
			state.settings.auto_reply.funnel.funnel_type,
			state.setFunnel,
		])
	)
	const first_messages = messages.filter(msg => msg.type == 'first')

	const handleFirstError = () => {
		if (first_messages.length > 0 && first_messages.length <= 4) {
			return 'Должно быть минимум 5 вариантов первого сообщения'
		}
		if (first_messages.some(msg => containsLink(msg.message.message))) {
			return 'В первом сообщении не должно быть ссылок'
		}
		if (first_messages.some(msg => msg.message.message.length > 150)) {
			return 'Первое сообщение не может быть длиннее 150 символов'
		}
	}
	return (
		<article>
			<ToggleButtonGroup
				color='secondary'
				className='mt-2'
				fullWidth={true}
				value={funnelType}
				size='small'
				exclusive
				onChange={(_e, v) => {
					if (v == undefined) return
					setFunnel('funnel_type', v)
				}}
				aria-label='Platform'
			>
				<ToggleButton value='order'>По порядку</ToggleButton>
				<ToggleButton value='keyword'>По ключевым словам</ToggleButton>
			</ToggleButtonGroup>
			<Bubble className='relative mt-4'>
				<TipBox content={firstMessageTip} />
				<h2 className='text-lg font-bold'>Первое сообщение</h2>
				<p className='text-sm'>
					Сообщение, которое будет отправлено в чат или в личные сообщения первым.
				</p>
				<Funnely
					error={handleFirstError()}
					type='first'
					messages={messages}
					onChange={v => setFunnel('messages', v)}
				/>
			</Bubble>
			{funnelType == 'keyword' && (
				<>
					<Bubble className='relative mt-4'>
						<TipBox content={keywordMessageTip} />
						<h2 className='text-lg font-bold'>Настройка диалога по ключевым словам</h2>
						<p className='text-sm'>
							Сообщения, которые будут отправляться, если пользователь продолжил общение.
						</p>
						<Funnely
							type='keyword'
							messages={messages}
							onChange={v => setFunnel('messages', v)}
						/>
					</Bubble>
					<Bubble className='relative mt-4'>
						<TipBox content={anyMessageTip} />
						<h2 className='text-lg font-bold'>Настройка диалога на любые фразы</h2>
						<p className='text-sm'>
							Сообщения, которые будут отправляться, если нет ключевых фраз.
						</p>
						<Funnely
							type='any'
							messages={messages}
							onChange={v => setFunnel('messages', v)}
						/>
					</Bubble>
				</>
			)}
			{funnelType == 'order' && (
				<Bubble className='relative mt-4'>
					<TipBox content={orderMessageTip} />
					<h2 className='text-lg font-bold'>Настройка диалога по порядку</h2>
					<p className='text-sm'>
						Сообщения, которые будут отправляться по порядку возрастания.
					</p>
					<Funnely
						type='order'
						messages={messages}
						onChange={v => setFunnel('messages', v)}
					/>
				</Bubble>
			)}
		</article>
	)
}
