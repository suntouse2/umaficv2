import PopOrDialog from '@components/common/PoporDialog'
import { Add, AutoAwesome, Edit, LibraryBooks } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { KeyboardEvent, MouseEvent, useState } from 'react'
import ValueTuner from './common/ValueTuner'
import magicWithAI from './helpers/magicWithAI'

type TagList = {
	id: string
	value: string
}[]

const animation = {
	initial: {
		opacity: 0,
		scale: 0.8,
	},
	animate: {
		opacity: 1,
		scale: 1,
	},
	exit: {
		opacity: 0,
		scale: 0.8,
	},
}
type TaggerProps = {
	activeTags: TagList
	onChange: (value: TagList) => void
	className?: string
	tagClassName?: string
	title?: string
	placeholder?: string
	selectable?: boolean
	useAI?: boolean
	inputVariant?: 'button' | 'hide' | 'visible'
	tagParser?: (value: string) => string
}

export default function Tagger({
	activeTags,
	tagClassName,
	inputVariant = 'visible',
	title,
	placeholder,
	onChange,
	useAI = true,
	selectable = true,
	className,
	tagParser,
}: TaggerProps) {
	const [tagInputValue, setTagInputValue] = useState<string>('')
	const [isList, setIsList] = useState<boolean>(false)
	const Input = isList ? 'textarea' : 'input'
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const handleAddTags = (newTags: string[]) => {
		const processedTags = tagParser ? newTags.map(tag => tagParser(tag)) : newTags

		const filtered = [
			...new Set(
				processedTags
					.map(t => t.trim().toLowerCase())
					.filter(Boolean)
					.filter(tag => !activeTags.some(kw => kw.value === tag))
			),
		]
		if (filtered.length === 0) return

		const newItems = filtered.map(t => ({
			id: nanoid(),
			value: t,
		}))

		onChange([...activeTags, ...newItems])
		setTagInputValue('')
	}

	const handleDeleteTags = (tagsId: string[]) => {
		onChange(activeTags.filter(tag => !tagsId.includes(tag.id)))
	}

	const handleChangeTag = (tagId: string, newValue: string) => {
		const processedValue = tagParser ? tagParser(newValue) : newValue
		if (activeTags.some(kw => kw.value === processedValue.toLowerCase()))
			return handleDeleteTags([tagId])
		onChange(
			activeTags.map(tag =>
				tag.id === tagId
					? { ...tag, value: processedValue.toLowerCase(), ai: false }
					: tag
			)
		)
	}

	const handleClear = () => {
		if (selectedIds.length) {
			handleDeleteTags(selectedIds)
		} else if (confirm('Вы точно хотите удалить все теги?')) {
			onChange([])
		}
	}

	const handleTagClick = (e: MouseEvent<HTMLSpanElement>, tagId: string) => {
		if (e.shiftKey && selectable) {
			e.preventDefault()
			e.stopPropagation()
			setSelectedIds(prevIds => {
				if (prevIds.includes(tagId)) return [...prevIds.filter(id => id !== tagId)]
				return [...prevIds, tagId]
			})
		}
	}

	const handleAwesome = async (prompt: string) => {
		const tags = await magicWithAI(prompt)
		handleAddTags(tags)
	}

	const handleTagInputKeyDown = (e: KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter' && !isList) {
			e.stopPropagation()
			e.preventDefault()
			handleAddTags([tagInputValue])
		}
	}

	const tagInput = (
		<div
			onClick={e => e.stopPropagation()}
			className={`flex px-3 items-start rounded-md min-w-60 w-max ${className}`}
		>
			<Input
				value={tagInputValue}
				onKeyDown={handleTagInputKeyDown}
				onChange={e => setTagInputValue(e.target.value)}
				className={`w-full mt-[9px] bg-[inherit] outline-none text-sm ${
					isList && 'min-h-40'
				}`}
				placeholder={
					placeholder ? placeholder : isList ? 'вставьте список' : 'введите фразу'
				}
			/>
			<IconButton onClick={() => handleAddTags(tagInputValue.split('\n'))}>
				<Add />
			</IconButton>
			<IconButton onClick={() => setIsList(list => !list)}>
				{isList ? <Edit /> : <LibraryBooks />}
			</IconButton>
			{useAI && (
				<IconButton onClick={() => handleAwesome(tagInputValue)}>
					<AutoAwesome className='rainbow' />
				</IconButton>
			)}
		</div>
	)

	return (
		<article className='mt-2 w-full'>
			{inputVariant === 'button' && (
				<PopOrDialog color='secondary' title={title ?? 'Добавить тег'}>
					{tagInput}
				</PopOrDialog>
			)}
			{inputVariant === 'visible' && tagInput}
			{selectable && activeTags.length > 0 && (
				<Button
					color={selectedIds.length ? 'primary' : 'error'}
					onClick={handleClear}
					variant='outlined'
					className='!ml-1 !rounded-full'
				>
					{selectedIds.length ? 'Удалить выбранные' : 'Удалить все'}
				</Button>
			)}
			<ul className={`flex w-full mt-3 gap-2 flex-wrap`}>
				<AnimatePresence>
					{activeTags.length > 0 &&
						activeTags.map(tag => (
							<motion.li layout {...animation} key={tag.id}>
								<ValueTuner
									render={
										<span
											className={`relative text-sm px-5 transition py-2 rounded-full flex justify-between bg-inputbg ${
												selectedIds.includes(tag.id) && '!bg-primary !text-white'
											} items-center mt-1 cursor-pointer select-none ${tagClassName}`}
											onClick={e => handleTagClick(e, tag.id)}
										>
											{tag.value}
										</span>
									}
									onDelete={() => handleDeleteTags([tag.id])}
									onAwesome={useAI ? v => handleAwesome(v) : undefined}
									showEditIcon={false}
									onChange={v => handleChangeTag(tag.id, v)}
									value={tag.value}
								/>
							</motion.li>
						))}
				</AnimatePresence>
			</ul>
		</article>
	)
}
