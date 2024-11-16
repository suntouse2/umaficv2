import { ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type NavItemProps = {
	onClick?: () => void
	to?: string
	href?: string
	Icon?: ReactElement
	title: string | ReactElement
}

export default function NavItem({
	Icon,
	title,
	onClick,
	to,
	href,
}: NavItemProps) {
	const location = useLocation()
	const navigate = useNavigate()

	const isActive = location.pathname === to

	const classes = `min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center w-full ${
		isActive
			? '[&>svg>path]:fill-secondaryHigh [&>svg>g>path]:fill-secondaryHigh'
			: 'hover:bg-softgray'
	}`

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (to) return navigate(to)
		if (href) return window.open(href, '_blank')
		if (onClick) return onClick()
	}

	return (
		<button onClick={handleClick} className={classes}>
			{Icon && Icon}
			{title}
		</button>
	)
}
