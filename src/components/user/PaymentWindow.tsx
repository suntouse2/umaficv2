import Bubble from '@components/common/Bubble';
import { Input } from '@components/common/Input';
import { Button } from '@mui/material';
import { useState } from 'react';
import * as EmailValidator from 'email-validator';
import { toast } from 'react-toastify';
import PaymentService from '@api/http/services/PaymentService';

export default function PaymentWindow() {
  const [email, setEmail] = useState<string>('');
  const [sum, setSum] = useState<string>('');

  const handlePayment = async () => {
    if (!EmailValidator.validate(email)) return toast.error('Неправильный формат почты');
    if (Number(sum) < 10) return toast.error('Сумма должна быть не меньше 10 рублей');

    const response = await PaymentService.sendPayment({
      email,
      amount: Number(sum),
    });
    window.location.href = response.data.acquiring_url;
  };

  return (
    <Bubble className='flex flex-col gap-2'>
      <h2 className='text-lg font-bold'>Введите вашу почту и сумму в ₽</h2>
      <Input placeholder='Почта' value={email} onChange={setEmail} />
      <Input type='number' min={10} placeholder='Сумма в ₽' value={sum} onChange={(v) => setSum(Math.max(Number(v), 10).toString())} />
      <Button onClick={handlePayment} variant='contained'>
        Перейти к оплате
      </Button>
    </Bubble>
  );
}
