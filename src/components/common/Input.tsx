import { ChangeEvent, KeyboardEvent } from 'react'

type InputProps = {
	value: string
	onChange: (value: string) => void
	onKeyDown?: (
		event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void
	onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	className?: string
	placeholder?: string
	error?: string
	maxLength?: number
	onlyDigits?: boolean
	minNumber?: number
	maxNumber?: number
}

export function Input({
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

	const inputProps = {
		className: `bg-inputbg w-full text-sm p-2 font-normal leading-7 rounded-lg outline-none ${className}`,
		value: value || '',
		onChange: handleChange,
		onBlur: handleBlur,
		onKeyDown,
		placeholder,
	}
	return (
		<div className='w-full'>
			<input {...inputProps} />
			{error && <p className='text-sm text-negative'>{error}</p>}
		</div>
	)
}
