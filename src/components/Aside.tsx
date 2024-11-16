import Balance from '@assets/balance.svg?react'
import Book from '@assets/book.svg?react'
import Exit from '@assets/exit.svg?react'
import Support from '@assets/support.svg?react'
import NavItem from '@components/NavItem'
import { useAuth } from '@context/AuthContext'
import { ContentCopy } from '@mui/icons-material'
import { supportLink } from '@static/links'
import { toast } from 'react-toastify'

type AsideProps = {
	asideState: boolean
	onChange: (state: boolean) => void
}

export default function Aside({ asideState, onChange }: AsideProps) {
	const { user, exit } = useAuth()

	const handleIdCopy = async () => {
		if (!user) return
		await navigator.clipboard.writeText(user.id.toString())
		return toast.info('ID Скопирован!')
	}

	const handleClose = () => {
		return onChange(false)
	}

	const handleExit = () => confirm('Вы точно хотите выйти?') && exit()

	return (
		<>
			<div
				className={`${
					asideState ? 'block' : 'hidden'
				} w-full fixed h-full bg-backdrop overflow-hidden   md:relative z-20`}
				onClick={handleClose}
			>
				<aside
					className={` bg-white border-r-[1px] h-dvh border-border overflow-auto w-48`}
					onClick={e => e.stopPropagation()}
				>
					<nav>
						<button
							className='w-full min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray'
							onClick={handleIdCopy}
							type='button'
						>
							<img src='/img/umafic.svg' className='w-4' />
							<p className='flex gap-2 items-center'>
								<span>#{user?.id}</span>
								<ContentCopy className='!text-[15px]' />
							</p>
						</button>
						<hr className='h-[1px] border-none bg-border' />
						<NavItem to='/' Icon={<Book />} title='Главная' />
						<hr className='h-[1px] border-none bg-border' />
						<NavItem to='/balance' Icon={<Balance />} title='Баланс' />
						<hr className='h-[1px] border-none bg-border' />
						<NavItem Icon={<Support />} title='Поддержка' href={supportLink} />
						<hr className='h-[1px] border-none bg-border' />
						<NavItem Icon={<Exit />} title='Выйти' onClick={handleExit} />
						<hr className='h-[1px] border-none bg-border' />
						<NavItem
							href='/documents/Публичная_оферта.docx'
							title={<span className='text-xs'>Публичная оферта</span>}
						/>
						<NavItem
							href='/documents/Пользовательское_соглашение.docx'
							title={
								<span className='text-xs text-left'>
									Пользовательское соглашение
								</span>
							}
						/>
					</nav>
				</aside>
			</div>
		</>
	)
}
