import { Avatar, Tooltip } from '@mui/material'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

type AvatarProps = {
	file: File | null
	onChange: (file: File | null) => void
}

export default function AvatarInput({ file, onChange }: AvatarProps) {
	const fileRef = useRef<HTMLInputElement | null>(null)
	const [isDrugged, setIsDrugged] = useState<boolean>(false)
	const [previewUrl, setPreviewUrl] = useState<string>('')

	useEffect(() => {
		if (file) {
			const objectUrl = URL.createObjectURL(file)
			setPreviewUrl(objectUrl)
			return () => {
				URL.revokeObjectURL(objectUrl)
			}
		} else {
			setPreviewUrl('')
		}
	}, [file])

	const handleAvatarClick = () => {
		if (fileRef.current) fileRef.current.click()
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0]
		onChange(file ?? null)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDrugged(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDrugged(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDrugged(false)
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onChange(e.dataTransfer.files[0])
		}
	}

	return (
		<>
			<Tooltip title='Отпустите чтобы загрузить' open={isDrugged} placement='top'>
				<Avatar
					src={previewUrl}
					onClick={handleAvatarClick}
					sx={{ width: 120, height: 120 }}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onDragLeave={handleDragLeave}
					style={{ cursor: 'pointer' }}
				/>
			</Tooltip>
			<input
				multiple={false}
				onChange={handleFileChange}
				accept='image/*'
				ref={fileRef}
				type='file'
				className='hidden'
			/>
		</>
	)
}
