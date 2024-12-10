import Container from '@components/ui/Container'
import { CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'

const PaymentWindow = lazy(() => import('@components/user/PaymentWindow'))

export default function PageBalance() {
	return (
		<section>
			<Container>
				<Suspense fallback={<CircularProgress />}>
					<PaymentWindow />
				</Suspense>
			</Container>
		</section>
	)
}
