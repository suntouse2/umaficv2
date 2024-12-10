import { PropsWithChildren } from 'react'

type ContainerProps = {
	className?: string
} & PropsWithChildren

export default function Container({ children, className }: ContainerProps) {
	return (
		<div
			className={`relative h-full w-full overflow-auto max-w-[1280px] mx-auto p-2 ${className}`}
		>
			{children}
		</div>
	)
}
