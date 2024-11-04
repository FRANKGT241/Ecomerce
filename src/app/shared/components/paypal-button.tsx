'use client'

import React from 'react'
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js"
import { useRouter } from 'next/navigation'

interface PayPalButtonProps {
  amount: string
  currency: string
  onSuccess?: (details: Record<string, unknown>) => void
  onError?: (error: Record<string, unknown>) => void
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, currency, onSuccess, onError }) => {
  const router = useRouter()

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: currency,
    intent: "capture",
  }

  const createOrder: PayPalButtonsComponentProps['createOrder'] = (data, actions) => {
    return actions?.order?.create({
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: amount,
                },
            },
        ],
        intent: 'CAPTURE'
    })
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = (data, actions) => {
    if (!actions.order) {
      return Promise.reject(new Error('Order actions not available'));
    }
    return actions.order.capture().then((details) => {
      if (onSuccess) {
        onSuccess(details)
      } else {
        const payerName = (details.payer as any)?.name?.given_name || "Customer"
        console.log('Transaction completed by ' + payerName)
        alert('¡Pago completado con éxito! Gracias por su compra.')
        router.push('/thank-you')
      }
    }).catch((error) => {
      if (onError) {
        onError(error)
      } else {
        console.error('Error capturing order:', error)
        alert('No se pudo completar el pago. Por favor, inténtelo de nuevo.')
      }
    })
  }

  const onErrorHandler: PayPalButtonsComponentProps['onError'] = (err) => {
    if (onError) {
      onError(err)
    } else {
      console.error('PayPal Checkout onError', err)
      alert('Ocurrió un error durante el proceso de pago. Por favor, inténtelo de nuevo.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal"
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
        />
      </PayPalScriptProvider>
    </div>
  )
}

export default PayPalButton