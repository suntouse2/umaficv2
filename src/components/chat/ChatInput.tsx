import FileSelectMenu from '@components/FileSelectMenu'
import MediaRenderer from '@components/MediaRenderer'
import { useChat } from '@context/chat/ChatContext'
import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType'
import useMediaService from '@hooks/useMediaService'
import { AttachFile, Delete, Send } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import {
	ChangeEvent,
	ClipboardEvent,
	DragEvent,
	KeyboardEvent,
	memo,
	useCallback,
	useRef,
	useState,
} from 'react'
import { toast } from 'react-toastify'

// type SendedMessage = { direct_id: number; content: TMessageContent; catch_slug: string };

// type ChatInputProps = {
//   onMessageSended?: (msg: SendedMessage) => void;
// };

export default memo(function ChatInput() {
	const { sendMessage } = useChat()

	const [message, setMessage] = useState<string>('')
	const [media, setMedia] = useState<TMessageContent['media']>(null)
	const [lastType, setLastType] = useState<TMediaTypes>('auto')
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { uploadFile } = useMediaService()

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleMenuClose = useCallback(() => setAnchorEl(null), [])

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const filepath = await uploadFile(file)
		setMedia({ filepath, type: lastType })
		e.target.value = ''
	}

	const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
		const items = e.clipboardData.items
		for (let i = 0; i < items.length; i++) {
			const item = items[i]
			if (item.kind === 'file') {
				const file = item.getAsFile()
				if (file) {
					const filepath = await uploadFile(file)
					setMedia({ filepath, type: 'auto' })
				}
			}
		}
	}

	const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const file = e.dataTransfer.files?.[0]
		if (!file) return
		const filepath = await uploadFile(file)
		setMedia({ filepath, type: 'auto' })
	}

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}

	const handleMediaUpdate = useCallback(
		(type: TMediaTypes) => {
			if (!fileInputRef.current) return
			fileInputRef.current.accept = InputAcceptByMediaType(type)
			setLastType(type)
			fileInputRef.current.click()
			handleMenuClose()
		},
		[handleMenuClose]
	)

	const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const handleSendMessage = async () => {
		try {
			if (!message && !media) {
				toast.error('Сообщение должно содержать текст или медиа.')
				return
			}
			const msg = await sendMessage({
				content: {
					message,
					media,
				},
				reply_to: null,
			})
			console.log(msg)

			setMessage('')
			setMedia(null)
		} catch {
			/* empty */
		}
	}

	return (
		<div onDrop={handleDrop} onDragOver={handleDragOver} onPaste={handlePaste}>
			<div className=' w-full flex p-4 gap-2 items-center'>
				<IconButton
					onClick={handleMenuClick}
					sx={{ width: '50px', height: '50px' }}
				>
					<AttachFile />
				</IconButton>
				<FileSelectMenu
					anchorEl={anchorEl}
					onClose={handleMenuClose}
					onClick={handleMediaUpdate}
				/>
				<TextField
					multiline
					fullWidth
					slotProps={{ htmlInput: { maxLength: 4096 } }}
					onKeyDown={handleEnter}
					variant='standard'
					value={message}
					onChange={v => setMessage(v.target.value)}
				/>
				<Button onClick={handleSendMessage} variant='text' className='!h-full'>
					<Send />
				</Button>
				<input
					ref={fileInputRef}
					type='file'
					hidden
					onChange={handleFileChange}
				/>
			</div>
			<div className='relative group'>
				{media && (
					<div className='absolute top-0 right-0'>
						<IconButton onClick={() => setMedia(null)}>
							<Delete className='hover:text-negative cursor-pointer' />
						</IconButton>
					</div>
				)}
				<MediaRenderer media={media} />
			</div>
		</div>
	)
})
