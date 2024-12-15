import { useAuth } from '@context/AuthContext'
import { ContentCopyRounded } from '@mui/icons-material'
import { memo } from 'react'
import { toast } from 'react-toastify'

export default memo(function Id() {
	const { user } = useAuth()

	const handleCopyId = async () => {
		if (!user) return
		await navigator.clipboard.writeText(user.id.toString())
		return toast.info('ID Скопирован!')
	}

	return (
		<button
			title='Нажмите чтобы скопировать ID'
			className='flex items-center transition-[background] duration-300 p-2 rounded-md gap-2 outline-none text-sm hover:bg-softgray'
			onClick={handleCopyId}
		>
			<span>#{user?.id}</span>
			<ContentCopyRounded className='!text-[15px]' />
		</button>
	)
})
