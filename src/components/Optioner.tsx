import { ReactElement } from 'react'

type OptionerProps<KeyType extends string> = {
	title?: string
	options: {
		key: KeyType
		icon?: ReactElement
		text: string
	}[]
	activeKey: KeyType
	onChange: (key: KeyType) => void
	className?: string
}

export default function Optioner<KeyType extends string>({
	options,
	activeKey,
	onChange,
	title,
	className,
}: OptionerProps<KeyType>) {
	return (
		<div className={`${className}`}>
			{title && <p className='w-full mb-2 text-softgray4 text-sm'>{title}:</p>}
			<div className={`flex items-center gap-2 `}>
				{options.map(option => (
					<div
						onClick={() => onChange(option.key)}
						key={option.key}
						className={`px-3 flex py-[5px] text-sm !transition-[background] border-primary border-[1px] rounded-full items-center gap-1 ${
							activeKey === option.key &&
							'!border-[2px] bg-opacity-20 bg-primary border-primary '
						}`}
					>
						{option.icon}
						{option.text}
					</div>
				))}
			</div>
		</div>
	)
}
