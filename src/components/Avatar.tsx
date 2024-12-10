import { memo, useEffect, useState } from 'react'
import useMediaService from '../hooks/useMediaService'
import AvatarInput from './common/AvatarInput'

type AvatarProps = {
	value: string | null
	onChange: (value: string | null) => void
}

export default memo(function Avatar({ value, onChange }: AvatarProps) {
	const [file, setFile] = useState<File | null>(null)
	const { getFile, uploadFile } = useMediaService()

	useEffect(() => {
		const fetchFile = async () => {
			if (!value) return setFile(null)
			const serverFile = await getFile(value)
			setFile(serverFile)
		}
		fetchFile()
	}, [value, getFile, file])

	const handleFileChange = async (file: File | null) => {
		if (!file) return onChange(null)
		if (file) {
			const filepath = await uploadFile(file)
			onChange(filepath)
		}
	}

	return <AvatarInput file={file} onChange={handleFileChange} />
})
