import { Button } from '@mui/material'
import { supportLink } from '@static/links'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

export default function PageError() {
	const navigate = useNavigate()
	const error = useRouteError()
	let errorMessage: string = ''
	let errorStack: string = ''

	if (isRouteErrorResponse(error)) {
		errorMessage = error.data || error.statusText
	} else if (error instanceof Error) {
		errorMessage = error.message
		errorStack = error.stack ?? ''
	} else if (typeof error === 'string') {
		errorMessage = error
	} else {
		console.error(error)
		errorMessage = 'Unknown error'
	}

	return (
		<section className='flex flex-col items-center justify-center w-dvw h-dvh'>
			<div className='flex flex-col items-center'>
				<div className='flex gap-4'>
					<div className='w-10 h-4 bg-dark rounded-full'></div>
					<div className='w-10 h-4 bg-dark rounded-full'></div>
				</div>
				<img src='/img/umafic.svg' className='w-16 mt-6' />
			</div>
			<div>
				<h1 className='text-3xl font-bold'>Ошибка</h1>
				<p>{errorMessage}</p>
				<p className='p-2 px-4 bg-dark  font-mono text-softgray w-full max-w-[700px] h-96 overflow-auto'>
					{errorStack}
				</p>
				<p className='text-softgray3'>Отправьте этот скриншот к нам в поддержку :(</p>
				<Button
					onClick={() => navigate('/')}
					className='!mt-4 !rounded-full'
					color='secondary'
					variant='outlined'
				>
					На главную
				</Button>
				<Button
					variant='outlined'
					className='!mt-4 !ml-2 !rounded-full'
					href={supportLink}
				>
					Тех.поддержка
				</Button>
			</div>
		</section>
	)
}
