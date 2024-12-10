import Aside from '@components/Aside'
import Header from '@components/Header'
import { Drawer, useMediaQuery, useTheme } from '@mui/material'
import { PropsWithChildren, useState } from 'react'

type MainLayoutProps = {
	isNeedHeader?: boolean
	isNeedAside?: boolean
} & PropsWithChildren

export default function MainLayout({ children }: MainLayoutProps) {
	const theme = useTheme()
	const isDesktopScreen = useMediaQuery(theme.breakpoints.up('md'))
	const [asideState, setAsideState] = useState<boolean>(isDesktopScreen)
	const asideSpace = asideState && isDesktopScreen ? 'ml-48' : ''

	const toggleAside = () => setAsideState(state => !state)

	return (
		<main className=''>
			{isDesktopScreen && asideState && <Aside />}
			{!isDesktopScreen && (
				<Drawer
					keepMounted
					transitionDuration={0}
					open={asideState}
					onClose={toggleAside}
				>
					<Aside />
				</Drawer>
			)}
			<Header className={asideSpace} onMenuClick={toggleAside} />
			<div className={asideSpace}>{children}</div>
		</main>
	)
}
