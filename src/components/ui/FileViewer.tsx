import { memo, useEffect, useState } from 'react'
import { renderContent } from '../helpers/renderContent'

type FileViewerProps = {
	file: File
	mediaType?: TMediaTypes
}

const FileViewer = memo(function FileViewer({ file, mediaType }: FileViewerProps) {
	const [blobUrl, setBlobUrl] = useState<string | null>(null)

	useEffect(() => {
		const url = URL.createObjectURL(file)
		setBlobUrl(url)
		return () => URL.revokeObjectURL(url)
	}, [file])

	return renderContent(blobUrl, file, mediaType)
})

export default FileViewer
