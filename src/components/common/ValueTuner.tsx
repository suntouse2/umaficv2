import { AutoAwesome, Check, Close, DeleteOutline, Edit } from '@mui/icons-material'
import { IconButton, Popover } from '@mui/material'
import { KeyboardEvent, ReactElement, useState } from 'react'
import Input from './Input'

type ValueTunerProps = {
	value: string
	render?: ReactElement | string
	customIcon?: ReactElement
	onlyDigits?: boolean
	minNumber?: number
	maxNumber?: number
	maxLength?: number
	showEditIcon?: boolean
	onChange: (value: string) => void
	onDelete?: () => void
	onAwesome?: (v: string) => void
}

export default function ValueTuner({
	value,
	render,
	onChange,
	onDelete,
	onAwesome,
	onlyDigits = false,
	customIcon,
	minNumber,
	maxNumber,
	maxLength,
	showEditIcon = true,
}: ValueTunerProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [inputValue, setInputValue] = useState<string>(value)

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			onChange(inputValue)
			setAnchorEl(null)
		}
	}

	return (
		<>
			<span onClick={e => setAnchorEl(e.currentTarget)} className='flex items-center'>
				<div className='flex items-center'>
					{render ?? value}
					{showEditIcon && (customIcon ?? <Edit className='ml-2 opacity-50' />)}
				</div>
			</span>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<div className='flex relative items-center '>
					<Input
						className='!p-1 !bg-[inherit]'
						onKeyDown={handleKeyDown}
						value={inputValue}
						onChange={v => {
							setInputValue(v)
						}}
						minNumber={minNumber}
						maxNumber={maxNumber}
						maxLength={maxLength}
						onlyDigits={onlyDigits}
					/>

					<IconButton onClick={() => setAnchorEl(null)}>
						<Close />
					</IconButton>
					{onDelete && (
						<IconButton onClick={onDelete}>
							<DeleteOutline color='error' />
						</IconButton>
					)}
					<IconButton
						onClick={() => {
							onChange(inputValue)
							setAnchorEl(null)
						}}
					>
						<Check color='success' />
					</IconButton>
					{onAwesome && (
						<IconButton
							onClick={() => {
								onAwesome(inputValue)
								setAnchorEl(null)
							}}
						>
							<AutoAwesome />
						</IconButton>
					)}
				</div>
			</Popover>
		</>
	)
}
