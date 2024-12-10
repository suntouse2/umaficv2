import { useAuth } from '@context/AuthContext'
import {
	AccountBalanceWalletRounded,
	ChatRounded,
	ContentCopyRounded,
	ExitToAppRounded,
	SpaceDashboardRounded,
	SupportAgentRounded,
} from '@mui/icons-material'
import { supportLink } from '@static/links'
import { toast } from 'react-toastify'
import Logo from './ui/AnimatedLogo'
import NavItem from './ui/NavItem'

export default function Aside() {
	const { user, exit } = useAuth()

	const handleCopyId = async () => {
		if (!user) return
		await navigator.clipboard.writeText(user.id.toString())
		return toast.dark('ID Скопирован!')
	}

	return (
		<aside className='fixed w-48 h-full bg-white border-r-[1px] border-border'>
			<nav>
				<button
					title='Нажмите чтобы скопировать ID'
					className='w-full min-h-12 outline-none text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray'
					onClick={handleCopyId}
				>
					<Logo size='20' />
					<span>#{user?.id}</span>
					<ContentCopyRounded className='!text-[15px]' />
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<NavItem to='/' Icon={<SpaceDashboardRounded />} title='Главная' />
				<hr className='h-[1px] border-none bg-border' />
				<NavItem to='/balance' Icon={<AccountBalanceWalletRounded />} title='Баланс' />
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
	)
}
