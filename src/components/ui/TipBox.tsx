import { QuestionMark } from '@mui/icons-material'
import {
	ClickAwayListener,
	Dialog,
	DialogContent,
	IconButton,
	Tooltip,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { memo, ReactElement, useState } from 'react'

type TooltipProps = {
	className?: string
	content: ReactElement | string
}

export default memo(function TipBox({ className, content }: TooltipProps) {
	const [dialogState, setDialogState] = useState<boolean>(false)
	const [tooltipState, setTooltipState] = useState<boolean>(false)
	const theme = useTheme()

	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

	const handleTooltipClick = () => {
		return isSmallScreen ? setDialogState(true) : setTooltipState(true)
	}

	return (
		<>
			<div
				onClick={handleTooltipClick}
				className={'absolute right-2 top-2' + ' ' + className}
			>
				<ClickAwayListener
					mouseEvent='onMouseDown'
					touchEvent='onTouchStart'
					onClickAway={event => {
						if (!event.target) return
						const target = event.target as Element
						if (!target.closest('.tooltip-content')) {
							setTooltipState(false)
						}
					}}
				>
					<Tooltip
						placement='bottom-start'
						disableFocusListener
						disableHoverListener
						disableTouchListener
						open={tooltipState}
						onClose={() => setTooltipState(false)}
						onOpen={() => setTooltipState(true)}
						title={<div className='tooltip-content'>{content}</div>}
					>
						<IconButton>
							<QuestionMark sx={{ width: 15, height: 15 }} />
						</IconButton>
					</Tooltip>
				</ClickAwayListener>
			</div>
			<Dialog
				open={dialogState}
				keepMounted
				onClose={() => setDialogState(false)}
				aria-describedby='alert-dialog-slide-description'
			>
				<DialogContent>{content}</DialogContent>
			</Dialog>
		</>
	)
})
