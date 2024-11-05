"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import PayPalButton from '@/app/shared/components/paypal-button'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  product?: any
}

interface CartItem {
  cart_detail_id: number
  quantity: number
  productNonPerishable?: {
    product_non_perishable_id: number
    name: string
    price: number
    images: string[]
  }
  productPerishable?: {
    product_perishable_id: number
    name: string
    price: number
    images: string[]
  }
}

export default function CartDrawer({ isOpen, onClose, product }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handlePaymentSuccess = (details: Record<string, unknown>) => {
    console.log('Payment successful', details)
    // Handle successful payment (e.g., update order status, navigate to confirmation page)
  }

  const handlePaymentError = (error: Record<string, unknown>) => {
    console.error('Payment error', error)
    // Handle payment error (e.g., show error message to user)
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.productNonPerishable?.price || item.productPerishable?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  // Close drawer when clicking escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Tu carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-red-500">
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <ShoppingBag className="w-8 h-8 mb-2" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => {
              const product = item.productNonPerishable || item.productPerishable
              if (!product) return null

              return (
                <div key={item.cart_detail_id} className="flex gap-4 mb-4 border-b pb-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <div className="flex items-center  justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-medium">Q{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">SUBTOTAL</span>
            <span className="font-medium">Q{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <Link 
              href="/public/shoppingCart"
              className="block w-full py-2 px-4 bg-white border-2 border-[#00BFFF] text-[#00BFFF] rounded text-center font-medium hover:bg-gray-50"
            >
              Ver carrito
            </Link>
            <PayPalButton
          amount="1"
          currency="USD"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
            <button className="w-full py-2 px-4 bg-[#00BFFF] text-white rounded font-medium hover:bg-[#0099CC]">
              Pagar pedido
            </button>
          </div>
        </div>
      </div>
    </>
  )
}