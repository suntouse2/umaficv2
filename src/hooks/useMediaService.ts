import MediaService from '@api/http/services/MediaService'
import { useCallback } from 'react'
import { useIndexedDB } from 'react-indexed-db-hook'
import { toast } from 'react-toastify'

export default function useMediaService() {
	const { add, getByID } = useIndexedDB('files')

	const uploadFile = useCallback(async (file: File): Promise<string> => {
		try {
			const response = await toast.promise(MediaService.uploadFile(file), {
				error: 'Ошибка загрузки',
				pending: 'Загрузка',
				success: 'Файл загружен',
			})
			const filepath = response.data.filename
			return filepath
		} catch {
			throw new Error('Не удалось загрузить файл на сервер')
		}
	}, [])

	const getFile = useCallback(
		async (filename: string): Promise<File> => {
			try {
				const fileFromDB = await getByID(filename)
				if (fileFromDB) return fileFromDB.file
				const response = await MediaService.downloadFile(filename)
				const file = new File([response.data], filename, { type: response.data.type })
				try {
					await add({ filename: filename, file: file })
				} catch {
					console.log('file was added before')
				}
				return file
			} catch (error) {
				console.log(error)
				throw new Error('Не удалось получить файл с сервера')
			}
		},
		[getByID, add]
	)

	const exitsFile = useCallback(async (filename: string): Promise<boolean> => {
		try {
			const response = await MediaService.exitsFile(filename)
			const data = response.data
			return data
		} catch {
			throw new Error('Не удалось проверить существование файла')
		}
	}, [])

	const getFileAsBlob = useCallback(
		async (filename: string): Promise<{ file: File; blob: string }> => {
			try {
				const file = await getFile(filename)
				if (!file) throw new Error()
				return {
					file: file,
					blob: URL.createObjectURL(file),
				}
			} catch {
				throw new Error('Не удалось получить файл. Попробуйте еще раз!')
			}
		},
		[getFile]
	)

	return { uploadFile, getFile, exitsFile, getFileAsBlob }
}
