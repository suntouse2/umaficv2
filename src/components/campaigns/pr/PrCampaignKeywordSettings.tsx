import { keywordTip, minusWordsTip } from '@components/helpers/directCampaignFormTips'
import Tagger from '@components/Tagger'
import Bubble from '@components/ui/Bubble'
import TipBox from '@components/ui/TipBox'
import { useShallow } from 'zustand/shallow'
import { usePrCampaignSettingsStore } from '../../../store/prCampaignSettingsStore'

export default function PrCampaignKeywordSettings() {
	const keywords = usePrCampaignSettingsStore(
		useShallow(state => state.settings.keywords)
	)
	const setKeyword = usePrCampaignSettingsStore(state => state.setKeyword)

	return (
		<article>
			<Bubble className='relative mt-4'>
				<TipBox content={keywordTip} />
				<h2 className='text-lg font-bold'>Ключевые фразы</h2>
				<p className='text-sm mt-2'>
					Фразы, которые система будет искать в чатах Telegram.
				</p>
				<Tagger
					inputVariant='button'
					title='Создать'
					activeTags={keywords.include}
					onChange={v => setKeyword('include', v)}
				/>
			</Bubble>
			<Bubble className='relative mt-4'>
				<TipBox content={minusWordsTip} />
				<h2 className='text-lg font-bold'>Минус-слова</h2>
				<p className='text-sm mt-2'>
					Фразы, которые система будет исключать из поиска в чатах Telegram.
				</p>
				<Tagger
					inputVariant='button'
					title='Создать'
					activeTags={keywords.exclude}
					onChange={v => setKeyword('exclude', v)}
				/>
			</Bubble>
		</article>
	)
}
