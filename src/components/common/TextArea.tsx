import { ChangeEvent, KeyboardEvent } from 'react'

type TextAreaProps = {
	resize?: boolean
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
}

export function TextArea({
	maxLength,
	value,
	resize = false,
	onChange,
	onKeyDown,
	onBlur,
	error,
	placeholder = '',
	className = '',
}: TextAreaProps) {
	const handleBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (onBlur) onBlur(e)
	}

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		let value = e.target.value
		if (maxLength) value = value.slice(0, maxLength)
		return onChange(value)
	}

	const textareaProps = {
		className: `bg-inputbg  w-full text-sm p-2 font-normal leading-7 rounded-lg outline-none ${className}`,
		value: value || '',
		onChange: handleChange,
		onBlur: handleBlur,
		onKeyDown,
		placeholder,
		resize,
	}
	return (
		<div className='w-full'>
			<textarea {...textareaProps} />
			{error && <p className='text-sm text-negative'>{error}</p>}
		</div>
	)
}
