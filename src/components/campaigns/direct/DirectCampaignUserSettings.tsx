import Avatar from '@components/Avatar'
import Input from '@components/common/Input'
import TextArea from '@components/common/TextArea'
import { profileTip } from '@components/helpers/directCampaignFormTips'
import Bubble from '@components/ui/Bubble'
import TipBox from '@components/ui/TipBox'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'

export default function DirectCampaignUserSettings() {
	const profile = useDirectCampaignSettingsStore(state => state.settings.profile)
	const setProfile = useDirectCampaignSettingsStore(state => state.setProfile)

	return (
		<Bubble className='relative mt-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 p-4 gap-5'>
				<div className='flex flex-col items-center  gap-5'>
					<Avatar onChange={v => setProfile('photo', v)} value={profile.photo} />
					<Input
						maxLength={64}
						value={profile.first_name}
						onChange={v => setProfile('first_name', v)}
						placeholder='Имя'
					/>
					<Input
						maxLength={64}
						value={profile.last_name}
						onChange={v => setProfile('last_name', v)}
						placeholder='Фамилия'
					/>
					<TextArea
						maxLength={70}
						className='min-h-32'
						value={profile.about}
						onChange={v => setProfile('about', v)}
						placeholder='Обо мне'
					/>
				</div>
				<div className='block md:hidden'>
					<TipBox content={profileTip} />
				</div>
				<p className='hidden md:block text-sm'>
					1. Нажмите на кнопку "Загрузить фото" и выберите изображение, которое вы хотели
					бы использовать для профиля бота. <br />
					<br /> 2. Введите имя и фамилию, которые будут отображаться на странице бота.
					<br />
					<br /> 3. Напишите краткую информацию в графу "О себе". Это поможет создать
					впечатление, что страница принадлежит реальному человеку.
					<br />
					<br /> 4. Обратите внимание, что указание сферы интересов не обязательно, но
					если вы хотите, чтобы ваш бот выглядел максимально натурально, можете добавить
					информацию о его увлечениях или интересах.
				</p>
			</div>
		</Bubble>
	)
}
