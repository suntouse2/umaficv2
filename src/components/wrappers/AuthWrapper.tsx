import { useAuth } from '@context/AuthContext'
import PageGate from '@pages/pageGate'
import { PropsWithChildren } from 'react'

export default function AuthWrapper({ children }: PropsWithChildren) {
	const { authState } = useAuth()

	return (
		<>
			{authState == 'server error' && (
				<PageGate loading={false} text='Ошибка сервера, попробуйте еще раз' />
			)}
			{authState == 'expired link' && (
				<PageGate loading={false} text={'Ссылка на авторизацию исчерпана'} />
			)}
			{authState == 'logged' && children}
		</>
	)
}
