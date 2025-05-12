import {
	useFetchDirectCampaignSettingsChat,
	useFetchGeoCities,
	useFetchGeoCountries,
	useFetchGeoLanguages,
	useFetchGeoRegions,
} from '@api/queries'
import { locationTip } from '@components/helpers/directCampaignFormTips'
import Select from '@components/Select'
import Bubble from '@components/ui/Bubble'
import TipBox from '@components/ui/TipBox'
import { usePrCampaignSettingsStore } from '../../../store/prCampaignSettingsStore'

export default function PrCampaignLocationSettings() {
	const geo = usePrCampaignSettingsStore(state => state.settings.geo)
	const setGeo = usePrCampaignSettingsStore(state => state.setGeo)
	const { data: languagesData } = useFetchGeoLanguages()
	const { data: countriesData } = useFetchGeoCountries(geo.language)
	const { data: regionsData } = useFetchGeoRegions(geo.country)
	const { data: citiesData } = useFetchGeoCities(geo.region)
	const { data: chatsStats } = useFetchDirectCampaignSettingsChat(geo)

	return (
		<>
			<Bubble className='relative mt-4'>
				<TipBox content={locationTip} />
				<h2 className='text-lg font-bold'>География</h2>
				<p className='text-sm mt-2 mb-2'>
					Выберите нужные регионы и увеличьте эффективность вашей рекламы! Настройте
					точечную рекламу и достигните своей целевой аудитории прямо сейчас.
				</p>
				<Select
					title='Добавить язык'
					onChange={v => setGeo('language', v)}
					options={languagesData ?? new Map()}
					activeOptions={geo.language}
					placeholder='Введите язык'
					hideInput
					className='mt-4'
				/>
				<Select
					title='Добавить страну'
					onChange={v => setGeo('country', v)}
					options={countriesData ?? new Map()}
					activeOptions={geo.country}
					placeholder='Введите страну'
					hideInput
					className='mt-4'
				/>
				<Select
					title='Добавить регион'
					onChange={v => setGeo('region', v)}
					options={regionsData ?? new Map()}
					activeOptions={geo.region}
					placeholder='Введите регион'
					hideInput
					className='mt-4'
				/>
				<Select
					title='Добавить город'
					onChange={v => setGeo('city', v)}
					options={citiesData ?? new Map()}
					activeOptions={geo.city}
					placeholder='Введите город'
					className='mt-4'
					hideInput
				/>
				<p className='mt-4 text-sm'>
					Всего найденных чатов: <b>{chatsStats?.channels_total}</b>
				</p>
			</Bubble>
		</>
	)
}
