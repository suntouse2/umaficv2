import { ErrorOutline } from '@mui/icons-material'
import { ChangeEvent, KeyboardEvent } from 'react'

type TextAreaProps = {
	value: string
	onChange: (value: string) => void
	onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
	onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void
	className?: string
	placeholder?: string
	error?: string
	minLength?: number
	maxLength?: number
}

export default function TextArea({
	maxLength,
	value,
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

	return (
		<div className='w-full'>
			<textarea
				className={`bg-inputbg  w-full text-sm p-2 font-normal leading-7 rounded-lg outline-none ${className}`}
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
