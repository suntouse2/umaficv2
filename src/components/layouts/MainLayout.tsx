import Aside from '@components/Aside'
import Header from '@components/Header'
import { Drawer, useMediaQuery, useTheme } from '@mui/material'
import { AnimatePresence } from 'motion/react'
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
		<main className='flex overflow-hidden flex-col w-dvw h-dvh relative'>
			<AnimatePresence>
				{isDesktopScreen && asideState && <Aside isDesktop />}
			</AnimatePresence>
			{!isDesktopScreen && (
				<Drawer open={asideState} onClose={toggleAside}>
					<Aside />
				</Drawer>
			)}
			<Header className={asideSpace} onMenuClick={toggleAside} />
			<div className={`${asideSpace}  overflow-hidden h-full`}>{children}</div>
		</main>
	)
}
