import { Button, Dialog } from '@mui/material'
import { AnimatePresence } from 'motion/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import FunnelMessageEditor from './FunnelyEditor'
import FunnelMessage from './FunnelyMessage'
import magicWithAI from './helpers/magicWithAI'

export type FunnelyMessage = {
	id: string
	filter: { id: string; value: string }[] | number | null
	type: 'keyword' | 'order' | 'first' | 'any'
	message: TMessageContent
}
type FunnelyProps = {
	messages: FunnelyMessage[]
	type: FunnelyMessage['type']
	onChange: (value: FunnelyMessage[]) => void
	error?: string
	filter?: { id: string; value: string }[] | number | null
	buttonTitle?: string
}

export default function Funnely({
	filter,
	messages,
	type,
	onChange,
	error,
	buttonTitle,
}: FunnelyProps) {
	const [editorDialog, setEditorDialog] = useState<boolean>(false)
	const [editingMessage, setEditingMessage] = useState<FunnelyMessage | null>(null)

	const handleOpenEditor = (message: FunnelyMessage | null) => {
		setEditingMessage(message)
		setEditorDialog(true)
	}

	const handleManageMessage = (payload: FunnelyMessage) => {
		if (messages.some(msg => msg.id === payload.id))
			handleChangeMessage({
				...payload,
				filter: filter ?? payload.filter,
			})
		else
			handleAddMessages([
				{
					...payload,
					filter: filter ?? payload.filter,
				},
			])
		setEditorDialog(false)
	}
	const handleAddMessages = (payload: FunnelyMessage[]) => {
		onChange([
			...messages,
			...payload.map(msg => ({
				...msg,
				filter: filter ?? msg.filter,
			})),
		])
	}
	const handleChangeMessage = (
		payload: { id: FunnelyMessage['id'] } & Partial<FunnelyMessage>
	) => {
		const updated = messages.map(msg =>
			msg.id === payload.id ? { ...msg, ...payload } : msg
		)
		onChange([...updated])
	}
	const handleRemoveMessage = (messageId: string) => {
		const updated = messages.filter(msg => msg.id !== messageId)
		onChange([...updated])
	}
	const handleMagicWithAI = async (msg: FunnelyMessage) => {
		if (msg.message.message.trim().length < 0) return
		const variants = await magicWithAI(msg.message.message, 5)
		console.log(variants)
		const messages: FunnelyMessage[] = variants.map(text => ({
			...msg,
			id: nanoid(),
			message: {
				...msg.message,
				message: text,
			},
		}))
		handleAddMessages(messages)
	}

	return (
		<article>
			<Dialog open={editorDialog} onClose={() => setEditorDialog(false)}>
				<FunnelMessageEditor
					onDone={handleManageMessage}
					type={filter === undefined || filter === null ? type : 'any'}
					message={editingMessage}
				/>
			</Dialog>
			<Button
				variant='outlined'
				color='secondary'
				className='!rounded-full !mt-2'
				type='button'
				onClick={() => handleOpenEditor(null)}
			>
				{buttonTitle ? buttonTitle : 'Создать'}
			</Button>
			<ul>
				<AnimatePresence>
					{messages
						.filter(msg =>
							filter !== undefined && filter !== null
								? msg.filter == filter
								: msg.type == type
						)
						.map(msg => (
							<FunnelMessage
								className='mt-2'
								onEdit={() => handleOpenEditor(msg)}
								onAwesome={() => handleMagicWithAI(msg)}
								onChange={v =>
									handleChangeMessage({
										id: msg.id,
										...v,
									})
								}
								onRemove={() => handleRemoveMessage(msg.id)}
								key={msg.id}
								message={msg}
							/>
						))}
				</AnimatePresence>
			</ul>
			{error && <b className='block mt-2 text-negative text-sm'>{error}</b>}
		</article>
	)
}
