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
}

export default function Funnely({ messages, type, onChange, error }: FunnelyProps) {
	const [editorDialog, setEditorDialog] = useState<boolean>(false)
	const [editingMessage, setEditingMessage] = useState<FunnelyMessage | null>(null)

	const handleOpenEditor = (message: FunnelyMessage | null) => {
		setEditingMessage(message)

		setEditorDialog(true)
	}

	const handleManageMessage = (payload: FunnelyMessage) => {
		if (messages.some(msg => msg.id === payload.id)) handleChangeMessage(payload)
		else handleAddMessages([payload])
		setEditorDialog(false)
	}
	const handleAddMessages = (payload: FunnelyMessage[]) => {
		onChange([...messages, ...payload])
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
					type={type}
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
				Создать
			</Button>
			<ul>
				<AnimatePresence>
					{messages
						.filter(msg => msg.type == type)
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
