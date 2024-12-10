import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType'
import useMediaService from '@hooks/useMediaService'
import { AttachFileRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import MediaSelectMenu from './MediaSelectMenu'

type MediaUploaderProps = {
	onMediaUploaded: (media: TFunnelMessage['media']) => void
}

export default function MediaUploader({ onMediaUploaded }: MediaUploaderProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [selectedType, setSelectedType] = useState<TMediaTypes>('auto')
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const { uploadFile } = useMediaService()

	const handleMenuToggle = (e?: MouseEvent<HTMLElement>) =>
		setAnchorEl(prev => (prev ? null : e?.currentTarget || null))

	const handleFileInputOpen = (type: TMediaTypes) => {
		if (fileInputRef.current) {
			fileInputRef.current.accept = InputAcceptByMediaType(type)
			setSelectedType(type)
			fileInputRef.current.click()
		}
	}

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		setAnchorEl(null)
		if (file) {
			const filepath = await uploadFile(file)
			onMediaUploaded({ filepath, type: selectedType })
			e.target.value = ''
		}
	}

	return (
		<>
			<input ref={fileInputRef} type='file' hidden onChange={handleFileChange} />
			<IconButton onClick={handleMenuToggle}>
				<AttachFileRounded className='rotate-[45deg]' />
			</IconButton>
			<MediaSelectMenu anchorEl={anchorEl} onClose={handleMenuToggle} onClick={handleFileInputOpen} />
		</>
	)
}
