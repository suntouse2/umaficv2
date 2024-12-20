import Bubble from '@components/ui/Bubble'
import Container from '@components/ui/Container'
import { lazy, Suspense } from 'react'

const AddChat = lazy(() => import('@components/user/AddChat'))

export default function PageAddChat() {
	return (
		<section>
			<Container className='flex w-full justify-center'>
				<Suspense>
					<Bubble>
						<AddChat />
					</Bubble>
				</Suspense>
			</Container>
		</section>
	)
}
