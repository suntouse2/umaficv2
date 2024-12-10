import { useAuth } from '@context/AuthContext'
import formatBalance from '@helpers/formatBalance'
import { AccountBalanceWalletRounded, MenuRounded } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { lazy, Suspense, useState } from 'react'

const Dialog = lazy(() => import('@mui/material/Dialog'))
const PaymentWindow = lazy(() => import('@components/user/PaymentWindow'))

type HeaderProps = {
	onMenuClick: () => void
	className?: string
}

export default function Header({ onMenuClick, className }: HeaderProps) {
	const { user } = useAuth()
	const [paymentDialogState, setPaymentDialogState] = useState<boolean>(false)

	return (
		<>
			<Suspense>
				<Dialog open={paymentDialogState} onClose={() => setPaymentDialogState(false)}>
					<PaymentWindow />
				</Dialog>
			</Suspense>
			<header className={`flex justify-between items-center py-2 px-3 ${className}`}>
				<IconButton onClick={onMenuClick}>
					<MenuRounded />
				</IconButton>
				<div className='flex gap-2 items-center'>
					<Button
						onClick={() => setPaymentDialogState(true)}
						variant='outlined'
						className='!rounded-full'
					>
						Пополнить
					</Button>
					<AccountBalanceWalletRounded
						className='bg-secondary rounded-full text-white p-2'
						sx={{ width: 35, height: 35 }}
					/>
					<span className='font-medium text-lg'>
						{formatBalance(Number(user?.balance ?? 0))}
					</span>
				</div>
			</header>
		</>
	)
}
