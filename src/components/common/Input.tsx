import { ErrorOutline } from '@mui/icons-material'
import { ChangeEvent, KeyboardEvent } from 'react'

type InputProps = {
	value: string
	onChange: (value: string) => void
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
	onBlur?: (event: ChangeEvent<HTMLInputElement>) => void
	className?: string
	placeholder?: string
	error?: string
	maxLength?: number
	onlyDigits?: boolean
	minNumber?: number
	maxNumber?: number
	type?: string
}

export default function Input({
	minNumber,
	maxNumber,
	maxLength,
	value,
	onChange,
	onKeyDown,
	onBlur,
	error,
	placeholder = '',
	onlyDigits = false,
	className = '',
	type,
}: InputProps) {
	const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
		if (onlyDigits && e.target.value.length > 0) {
			let value = parseInt(e.target.value)
			if (minNumber !== undefined) value = Math.max(value, minNumber)
			if (maxNumber !== undefined) value = Math.min(maxNumber, value)
			onChange(value.toString())
		}
		if (onBlur) onBlur(e)
	}
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value
		if (onlyDigits) value = value.replace(/\D/g, '')
		if (maxLength) value = value.slice(0, maxLength)
		return onChange(value)
	}

	return (
		<div className='w-full'>
			<input
				type={type}
				className={`bg-inputbg w-full text-sm p-2 font-normal leading-7 rounded-lg outline-none ${className}`}
				value={value || ''}
				onChange={handleChange}
				onBlur={handleBlur}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
			/>
			{error && (
				<p className='flex items-center gap-1 mt-2 text-sm text-negative'>
					<ErrorOutline />
					{error}
				</p>
			)}
		</div>
	)
}
