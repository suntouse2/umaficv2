import PopOrDialog from '@components/common/PoporDialog'
import { RemoveCircleOutline } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { KeyboardEvent, useState } from 'react'

type SelectProps = {
	title: string
	options: Map<string, string>
	activeOptions: string[]
	onChange: (value: string[]) => void
	placeholder: string
	hideInput?: boolean
	className?: string
}
const animation = {
	initial: {
		opacity: 0,
		y: -5,
	},
	animate: {
		opacity: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		y: 5,
	},
}

export default function Select({
	title,
	options,
	activeOptions,
	placeholder,
	hideInput,
	className,
	onChange,
}: SelectProps) {
	const [input, setInput] = useState<string>('')
	const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)

	const filteredOptions = Array.from(options).filter(
		option => input && option[1].toLowerCase().startsWith(input.toLowerCase())
	)
	const handleAddOption = (option: string) => {
		onChange([...new Set([...activeOptions, option])])
	}
	const handleDeleteOption = (option: string) => {
		onChange([...activeOptions.filter(item => item !== option)])
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

	const Input = (
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

	return (
		<article className={className}>
			{hideInput ? <PopOrDialog title={title}>{Input}</PopOrDialog> : Input}
			<ul>
				<AnimatePresence>
					{activeOptions.map(v => (
						<motion.li
							className='bg-inputbg w-full flex justify-between items-center mt-2 rounded-xl px-3 mb-2'
							layout
							key={v}
							{...animation}
						>
							{options.get(v)}
							<IconButton edge='end' onClick={() => handleDeleteOption(v)}>
								<RemoveCircleOutline color='error' />
							</IconButton>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</article>
	)
}
