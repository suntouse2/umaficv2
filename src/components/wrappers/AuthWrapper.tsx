import { useAuth } from '@context/AuthContext'
import PageGate from '@pages/pageGate'
import { PropsWithChildren, useEffect } from 'react'

export default function AuthWrapper({ children }: PropsWithChildren) {
	const { authState, redirect } = useAuth()

	useEffect(() => {
		// if (authState === 'logged-out') redirect()
	}, [authState, redirect])

	return (
		<>
			{authState == 'server error' && (
				<PageGate loading={false} text='Ошибка сервера, попробуйте еще раз' />
			)}
			{authState == 'pending' && <PageGate loading text={'Загрузка...'} />}
			{authState == 'expired link' && (
				<PageGate loading={false} text={'Ссылка на авторизацию исчерпана'} />
			)}
			{authState == 'logged' && children}
		</>
	)
}
