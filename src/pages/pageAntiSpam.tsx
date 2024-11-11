import { Send } from '@mui/icons-material'
import { Button } from '@mui/material'

export default function pageAntiSpam() {
	return (
		<section className='py-12 bg-gray-50 overflow-auto'>
			<div className='text-center max-w-3xl mx-auto px-4'>
				<div className='flex flex-col items-center gap-4 mb-16'>
					<img className='w-32' src='/img/umaficbot.svg' />
					<h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
						Представляем вашему вниманию бесплатный анти-спам бот — ваш надежный
						помощник в мире чатов!
						<Button
							href='https://t.me/UmaficAntiSpamBot'
							className=' !mb-4 !mt-4 !ml-4'
							endIcon={<Send />}
							variant='outlined'
						>
							Попробовать
						</Button>
					</h1>
				</div>

				<p className='text-lg text-gray-600 mb-8'>
					Устали от надоедливого спама? Наш анти-спам бот предлагает огромный
					спектр возможностей, чтобы сделать ваше общение комфортным и
					безопасным!
				</p>
				<h2 className='text-2xl md:text-3xl font-semibold text-gray-700 mb-4'>
					Что вы получите?
				</h2>
				<ul className='space-y-4 text-left text-gray-700'>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>8 уровней проверки сообщений на спам:</b> Никаких лишних
							сообщений — только важные и нужные!
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Полностью автоматическая работа:</b> Забудьте о постоянном
							мониторинге чата — наш бот сделает это за вас!
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Функция администратора чата:</b> Управляйте своим чатом легко и
							эффективно!
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Автоматическое общение в режиме вопрос-ответ:</b> Ваши
							пользователи всегда получат ответы на свои вопросы!
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Подписка на ваш канал:</b> Настройте бота так, чтобы участники
							чата могли подписываться на ваш канал и получать актуальные
							обновления.
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Прохождение капчи:</b> Защита от ботов и спама на высшем
							уровне!
						</span>
					</li>
					<li className='flex items-start space-x-2'>
						<span className='text-green-600 font-bold'>•</span>
						<span className='text-lg'>
							<b>Работа по вашим ключевым фразам:</b> Настройте бота так, как
							вам нужно!
						</span>
					</li>
				</ul>
				<Button
					href='https://t.me/UmaficAntiSpamBot'
					className='!mt-4'
					endIcon={<Send />}
					variant='outlined'
				>
					Перейти в бота
				</Button>
			</div>
		</section>
	)
}
