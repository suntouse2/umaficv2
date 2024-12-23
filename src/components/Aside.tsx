import { useAuth } from '@context/AuthContext'
import {
	AccountBalanceWalletRounded,
	ChatRounded,
	ExitToAppRounded,
	SpaceDashboardRounded,
	SupportAgentRounded,
} from '@mui/icons-material'
import { Dialog } from '@mui/material'
import { supportLink } from '@static/links'
import { Suspense, useState } from 'react'
import Logo from './ui/AnimatedLogo'
import NavItem from './ui/NavItem'
import Id from './user/Id'
import PaymentWindow from './user/PaymentWindow'

export default function Aside({ isDesktop }: { isDesktop?: boolean }) {
	const { exit } = useAuth()
	const [paymentDialogState, setPaymentDialogState] = useState<boolean>(false)
	return (
		<>
			<Suspense>
				<Dialog open={paymentDialogState} onClose={() => setPaymentDialogState(false)}>
					<PaymentWindow />
				</Dialog>
			</Suspense>
			<aside
				className={
					isDesktop
						? 'fixed w-48 h-full bg-white border-r-[1px] border-border'
						: 'w-48 h-full bg-white border-r-[1px] border-border'
				}
			>
				<nav>
					<div className='flex items-center px-4 py-2 min-h-12 gap-2'>
						<Logo size='20' />
						<Id />
					</div>
					<hr className='h-[1px] border-none bg-border' />
					<NavItem to='/' Icon={<SpaceDashboardRounded />} title='Главная' />
					<hr className='h-[1px] border-none bg-border' />
					<NavItem
						onClick={() => setPaymentDialogState(true)}
						Icon={<AccountBalanceWalletRounded />}
						title='Баланс'
					/>
					<hr className='h-[1px] border-none bg-border' />
					<NavItem Icon={<SupportAgentRounded />} title='Поддержка' href={supportLink} />
					<hr className='h-[1px] border-none bg-border' />
					<NavItem to='/addChat' Icon={<ChatRounded />} title='Добавить чаты' />
					<hr className='h-[1px] border-none bg-border' />
					<NavItem Icon={<ExitToAppRounded />} title='Выйти' onClick={exit} />
					<hr className='h-[1px] border-none bg-border' />
					<NavItem
						href='/documents/Публичная_оферта.docx'
						title={<span className='text-xs'>Публичная оферта</span>}
					/>
					<NavItem
						href='/documents/Пользовательское_соглашение.docx'
						title={<span className='text-xs text-left'>Пользовательское соглашение</span>}
					/>
				</nav>
			</aside>
		</>
	)
}
