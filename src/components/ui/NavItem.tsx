import { ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type NavItemProps = {
	onClick?: () => void
	to?: string
	href?: string
	Icon?: ReactElement
	title: string | ReactElement
}

export default function NavItem({ Icon, title, onClick, to, href }: NavItemProps) {
	const location = useLocation()
	const navigate = useNavigate()

	const isActive = location.pathname === to
	const color = isActive ? 'text-primary font-bold' : 'text-softgray4'

	const handleClick = () => {
		if (to) return navigate(to)
		if (href) return window.open(href, '_blank')
		if (onClick) return onClick()
	}

	return (
		<button
			type='button'
			onClick={handleClick}
			className={` min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center w-full hover:bg-softgray ${color}`}
		>
			{Icon && Icon}
			{title}
		</button>
	)
}
