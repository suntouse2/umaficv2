import PaymentService from '@api/http/services/PaymentService'
import { Input } from '@components/common/Input'
import { Button } from '@mui/material'
import * as EmailValidator from 'email-validator'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function PaymentWindow() {
	const [email, setEmail] = useState<string>('')
	const [sum, setSum] = useState<string>('500')

	const handlePayment = async () => {
		if (!EmailValidator.validate(email))
			return toast.error('Неправильный формат почты')
		const response = await PaymentService.sendPayment({
			email,
			amount: Number(sum),
		})
		window.location.href = response.data.acquiring_url
	}

	return (
		<form className='flex flex-col gap-4 p-4'>
			<h2 className='text-lg font-bold'>Введите вашу почту и сумму в ₽</h2>
			<Input placeholder='Почта' value={email} onChange={setEmail} />
			<Input
				minNumber={500}
				onlyDigits
				placeholder='Сумма в ₽'
				value={sum}
				onChange={v => setSum(v)}
			/>
			<Button color='success' onClick={handlePayment} variant='contained'>
				Перейти к оплате
			</Button>
		</form>
	)
}
