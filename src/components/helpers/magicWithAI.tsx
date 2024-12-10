import UtilsService from '@api/http/services/UtilsService'
import { AutoAwesome } from '@mui/icons-material'
import _ from 'lodash'
import { toast } from 'react-toastify'

export default async function magicWithAI(
	text: string,
	variants?: number
): Promise<string[]> {
	try {
		if (text.length == 0) throw new Error('Для генерации надо что-то написать')
		const { data } = await toast.promise(
			variants !== undefined
				? UtilsService.spintax(text, variants)
				: UtilsService.variants(text),
			{
				pending: {
					className: 'rainbowBorderGlow',
					style: {
						color: 'black',
					},
					render: 'Генерация вариантов',
					icon: (
						<span>
							<AutoAwesome />
						</span>
					),
				},
				error: 'Не удалось сгенерировать варианты',
			}
		)
		document.getElementById('root')?.classList.remove('rainbowBorder')
		return _.uniq(data.map(text => text.toLowerCase()))
	} catch (error) {
		document.getElementById('root')?.classList.remove('rainbowBorder')
		toast.error(String(error))
		return []
	}
}
