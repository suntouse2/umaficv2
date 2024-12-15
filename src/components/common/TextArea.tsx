import { ErrorOutline } from '@mui/icons-material'
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react'

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
	autoHeight?: boolean
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
	autoHeight = false,
}: TextAreaProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)

	// Автоматическая настройка высоты
	useEffect(() => {
		if (autoHeight && textareaRef.current) {
			const textarea = textareaRef.current
			textarea.style.height = 'auto' // Сбрасываем высоту перед расчётом
			textarea.style.height = `${textarea.scrollHeight - 30}px` // Устанавливаем высоту по содержимому
		}
	}, [value, autoHeight])

	const handleBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (onBlur) onBlur(e)
	}

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		let newValue = e.target.value
		if (maxLength) newValue = newValue.slice(0, maxLength)
		onChange(newValue)
	}

	return (
		<div className='w-full'>
			<textarea
				ref={textareaRef}
				className={`bg-inputbg w-full text-sm p-2 font-normal leading-7 rounded-lg outline-none ${className}`}
				value={value || ''}
				onChange={handleChange}
				onBlur={handleBlur}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				style={
					autoHeight
						? {
								overflow: 'hidden',
								resize: 'none',
								height: '20px',
						  }
						: undefined
				}
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
