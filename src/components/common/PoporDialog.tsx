import { Button, Dialog, Popover, useMediaQuery, useTheme } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button'
import { OverridableStringUnion } from '@mui/types'
import React, { PropsWithChildren, useState } from 'react'

type PopOrDialogProps = {
	title: string
	color?: OverridableStringUnion<
		'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
		ButtonPropsColorOverrides
	>
} & PropsWithChildren

export default function PopOrDialog({ title, color, children }: PopOrDialogProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const theme = useTheme()
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	return (
		<>
			<Button
				variant='outlined'
				color={color}
				className='!rounded-full'
				onClick={handleClick}
			>
				{title}
			</Button>
			{!isSmallScreen ? (
				<Popover
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'center',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'center',
						horizontal: 'left',
					}}
				>
					{children}
				</Popover>
			) : (
				<Dialog open={open} onClose={handleClose}>
					{children}
				</Dialog>
			)}
		</>
	)
}
