import dateToRelativeString from '@helpers/dateToRelativeString'
import { Button, ButtonGroup, Popover } from '@mui/material'
import { motion } from 'motion/react'
import { MouseEvent, useState } from 'react'
import Input from './common/Input'

type DirectCampaignCheckFoundMessageProps = {
	message: TDirectCampaignSettingsCheckMessages
	onKeywordInclude: (value: string) => void
	onKeywordExclude: (value: string) => void
}

export default function Lid({
	message,
	onKeywordInclude,
	onKeywordExclude,
}: DirectCampaignCheckFoundMessageProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [editingWord, setEditingWord] = useState<string>('')
	const formatWord = (word: string) => {
		return word.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '')
	}

	const splittedWords = message.content.message.split(' ')
	const messageDate = dateToRelativeString(new Date(message.date))

	const renderWords = splittedWords.map((word, index) => (
		<span key={index} onClick={e => openPopover(e, word)} className='cursor-pointer'>
			{word + ' '}
		</span>
	))

	const openPopover = (e: MouseEvent<HTMLElement>, word: string) => {
		setAnchorEl(e.currentTarget)
		setEditingWord(formatWord(word))
	}
	const handleAddKeyword = () => {
		onKeywordInclude(editingWord)
		setAnchorEl(null)
	}
	const handleRemoveKeyword = () => {
		onKeywordExclude(editingWord)
		setAnchorEl(null)
	}

	return (
		<motion.div
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className='w-full mt-2 bg-inputbg text-sm p-3 rounded-sm'
		>
			{renderWords}
			<div className='w-full flex justify-end'>
				<span className='text-xs mt-2 text-softgray4'>{messageDate}</span>
			</div>
			<Popover
				onClose={() => setAnchorEl(null)}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
			>
				<div className='bg-white p-2 flex flex-col gap-2'>
					<Input value={editingWord} onChange={setEditingWord} />
					<ButtonGroup>
						<Button
							disabled={editingWord.trim().length == 0}
							onClick={handleRemoveKeyword}
							color='error'
						>
							Исключить
						</Button>
						<Button
							disabled={editingWord.trim().length == 0}
							onClick={handleAddKeyword}
							color='success'
						>
							Добавить
						</Button>
					</ButtonGroup>
				</div>
			</Popover>
		</motion.div>
	)
}
