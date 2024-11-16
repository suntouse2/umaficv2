import TagInput from '@components/common/TagInput'
import TagList from '@components/common/TagList'
import { addTag, addTagList } from '@helpers/tagHelper'
import { Button, Dialog, Popover } from '@mui/material'
import getBreakpoints from '@static/mediaBreakpoints'
import { MouseEvent, useCallback, useMemo, useState } from 'react'
type KeywordManagerProps = {
	value: Set<string>
	onChange: (value: Set<string>) => void
}

export default function KeywordManager({
	value,
	onChange,
}: KeywordManagerProps) {
	const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null)
	const [dialogState, setDialogState] = useState<boolean>(false)

	const closePopupAndDialog = useCallback(() => {
		setPopoverAnchor(null)
		setDialogState(false)
	}, [])

	const openPopupOrDialog = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		return window.innerWidth <= getBreakpoints(false).md
			? setDialogState(true)
			: setPopoverAnchor(e.currentTarget)
	}, [])

	const handleAddTag = useCallback(
		(newTag: string, type: 'list' | 'single') => {
			const updatedTags =
				type == 'list' ? addTagList(value, newTag) : addTag(value, newTag)
			onChange(updatedTags)
		},
		[value, onChange]
	)

	const popoverPosition = useMemo(
		() => ({
			anchorOrigin: {
				vertical: 'center' as const,
				horizontal: 'right' as const,
			},
			transformOrigin: {
				vertical: 'center' as const,
				horizontal: 'left' as const,
			},
		}),
		[]
	)

	const deleteAllTags = () => {
		if (confirm('Вы уверены что хотите удалить все теги?')) onChange(new Set())
	}

	return (
		<div>
			<div>
				<div className='mt-3 flex gap-2'>
					<Button
						onClick={openPopupOrDialog}
						color='secondary'
						variant='outlined'
						className='!rounded-full '
					>
						Создать
					</Button>
					<Button
						onClick={deleteAllTags}
						variant='outlined'
						color='error'
						className='!rounded-full'
					>
						Удалить все
					</Button>
				</div>

				<Popover
					{...popoverPosition}
					onClose={() => setPopoverAnchor(null)}
					open={Boolean(popoverAnchor)}
					anchorEl={popoverAnchor}
				>
					<TagInput onClose={closePopupAndDialog} onAdd={handleAddTag} />
				</Popover>

				<Dialog open={dialogState} onClose={() => setDialogState(false)}>
					<TagInput onClose={closePopupAndDialog} onAdd={handleAddTag} />
				</Dialog>
			</div>
			<TagList editable={true} value={value} onChange={onChange} />
		</div>
	)
}
