import PaymentService from '@api/http/services/PaymentService'
import Input from '@components/common/Input'
import { Button } from '@mui/material'
import * as EmailValidator from 'email-validator'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'

export default function PaymentWindow() {
	const [email, setEmail] = useState<string>('')
	const [amount, setAmount] = useState<string>('')

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault()
			if (!EmailValidator.validate(email)) return toast.error('Неправильный формат почты')
			const { data } = await PaymentService.createPayment({
				email,
				amount: parseInt(amount),
			})
			window.location.href = data.acquiring_url
		} catch (error) {
			toast.error(String(error))
			console.log(error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='flex flex-col p-4'>
			<h2 className='text-lg font-bold'>Пополнение счета</h2>
			<p className='mb-2'>Введите вашу почту и сумму в рублях, чтобы пополнить счет.</p>
			<Input className='mb-2' placeholder='Почта' value={email} onChange={setEmail} />
			<Input
				className='mb-4'
				minNumber={3000}
				onlyDigits
				placeholder='Сумма в ₽'
				value={amount}
				onChange={v => setAmount(v)}
			/>
			<Button type='submit' color='success' variant='contained'>
				Перейти к оплате
			</Button>
		</form>
	)
}
