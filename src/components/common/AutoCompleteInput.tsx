import { KeyboardEvent, useState } from 'react'
type SelectInputProps = {
	options: Map<string, string>
	onAdd: (key: string) => void
	placeholder: string
}

export default function AutoCompleteInput({
	placeholder,
	options,
	onAdd,
}: SelectInputProps) {
	const [input, setInput] = useState<string>('')
	const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)

	const filteredOptions = Array.from(options).filter(
		option => input && option[1].toLowerCase().startsWith(input.toLowerCase())
	)
	const handleAddOption = (key: string) => {
		onAdd(key)
		setInput('')
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.code === 'Enter' && selectedOptionIndex !== null) {
			const selectedOption = filteredOptions[selectedOptionIndex]
			handleAddOption(selectedOption[0])
		}
		if (e.code === 'ArrowDown') {
			setSelectedOptionIndex(prev =>
				Math.min((prev ?? -1) + 1, filteredOptions.length - 1)
			)
		}
		if (e.code === 'ArrowUp') {
			setSelectedOptionIndex(prev => Math.max((prev ?? 1) - 1, 0))
		}
	}

	return (
		<div>
			<input
				onKeyDown={handleKeyDown}
				value={input}
				onChange={e => setInput(e.target.value)}
				className='w-full outline-none text-sm  p-2 rounded-md'
				placeholder={placeholder}
			/>
			<ul className='max-h-64 overflow-auto border-t-softgray border-t-[1px]'>
				{filteredOptions.map((option, index) => (
					<li
						onClick={() => handleAddOption(option[0])}
						className={`p-1 text-sm cursor-pointer hover:bg-softgray 
							${selectedOptionIndex === index && 'bg-softgray'}`}
						key={option[0]}
					>
						{option[1]}
					</li>
				))}
			</ul>
		</div>
	)
}
