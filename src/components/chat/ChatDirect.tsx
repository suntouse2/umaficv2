import { stringAvatar } from '@helpers/stringAvatar'
import { FavoriteRounded } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useChatStore } from '../../store/chatStore'

type DirectProps = {
	direct: TChatDirect
}
export default memo(function ChatDirect({ direct }: DirectProps) {
	const favoriteDirect = useChatStore(state => state.favoriteDirect)
	const user = `${direct.user.first_name ?? ''} ${direct.user.last_name ?? ''}`.slice(
		0,
		20
	)
	const handleFavorite = () => {
		favoriteDirect(direct.id, !direct.is_favorite)
	}
	return (
		<div>
			<div className='relative flex items-center justify-between border-border gap-2 overflow-hidden py-1  px-2 w-full transition-[background]'>
				<div className='flex items-center gap-2'>
					<Link
						to={direct.user.link}
						target='_blank'
						className='cursor-pointer flex gap-2 items-center'
					>
						<Avatar {...stringAvatar(direct.user.first_name)} />
						<b className='text-sm text-nowrap'>{user}</b>
					</Link>
					<span className='text-xs bg-softgray px-2 py-1 rounded-full'>
						#{direct.user.id}
					</span>
				</div>
				<IconButton onClick={handleFavorite}>
					<FavoriteRounded
						fontSize='small'
						color={direct.is_favorite ? 'primary' : 'inherit'}
					/>
				</IconButton>
			</div>
		</div>
	)
})
