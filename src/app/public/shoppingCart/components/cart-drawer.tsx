"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import PayPalButton from '@/app/shared/components/paypal-button'
import { useSession } from 'next-auth/react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface ProductsNonPerishable {
  name: string
  description: string
  discount: string
  images: string[]
  price: string | number
}

interface ProductsPerishable {
  name: string
  description: string
  discount: string
  images: string[]
  price: string | number
}

interface CartDetail {
  cart_detail_id: number
  cart_id: number
  product_non_perishable_id: number | null
  product_perishable_id: number | null
  quantity: number
  state: boolean
  ProductsNonPerishable: ProductsNonPerishable | null
  ProductsPerishable: ProductsPerishable | null
}

interface Cart {
  cart_id: number
  client_id: number
  creation_date: string
  state: boolean
  CartDetails: CartDetail[]
}

interface ApiResponse {
  amount: number
  cart: Cart[]
}

interface CartItem {
  cart_detail_id: number
  quantity: number
  name: string
  price: number
  images: string[]
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)

  const { data: session } = useSession()

  const handlePaymentSuccess = (details: Record<string, unknown>) => {
    console.log('Pago exitoso', details)
    // Manejar el pago exitoso (por ejemplo, actualizar el estado del pedido, navegar a la página de confirmación)
  }

  const handlePaymentError = (error: Record<string, unknown>) => {
    console.error('Error en el pago', error)
    // Manejar el error de pago (por ejemplo, mostrar un mensaje de error al usuario)
  }

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!session?.user?.email) {
        setError('Usuario no autenticado')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/data/allCartDetails/${session.user.email}`)
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del carrito')
        }
        const data: ApiResponse = await response.json()

        const allCartDetails = data.cart.flatMap(cart => cart.CartDetails)
        const activeCartDetails = allCartDetails.filter(
          detail => detail.state && (detail.ProductsNonPerishable || detail.ProductsPerishable)
        )

        const mappedItems: CartItem[] = activeCartDetails.map(detail => {
          const product = detail.ProductsNonPerishable || detail.ProductsPerishable
          if (!product) {
            throw new Error('Producto no encontrado en los detalles del carrito')
          }

          const images = product.images.map(image => {
            const normalizedImage = image.replace(/\\/g, '/')
            return `http://localhost:3001/${normalizedImage}`
          })

          return {
            cart_detail_id: detail.cart_detail_id,
            quantity: detail.quantity,
            name: product.name,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            images,
          }
        })

        setItems(mappedItems)
        setAmount(data.amount)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los detalles del carrito')
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchCartDetails()
    }
  }, [isOpen, session])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Tu carrito</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p className="text-lg">{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="text-xl">Tu carrito está vacío</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cart_detail_id} className="flex gap-6 mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.images[0] ? item.images[0] : '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-800 mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                        <button 
                          className="p-1 hover:bg-gray-200 rounded-full transition duration-200"
                          disabled
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-gray-800 font-medium">{item.quantity}</span>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded-full transition duration-200"
                          disabled
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <span className="font-semibold text-lg text-gray-800">Q{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold text-gray-800">SUBTOTAL</span>
              <span className="text-lg font-semibold text-gray-800">Q{amount.toFixed(2)}</span>
            </div>
            <div className="space-y-4">
              <Link 
                href="/public/shoppingCart"
                className="block w-full py-3 px-4 bg-white border-2 border-[#00BFFF] text-[#00BFFF] rounded-full text-center font-semibold hover:bg-gray-50 transition duration-200"
              >
                Ver carrito
              </Link>
              <PayPalButton
                amount={amount.toFixed(2)}
                currency="USD"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              <button 
                className="w-full py-3 px-4 bg-[#00BFFF] text-white rounded-full font-semibold hover:bg-[#0099CC] transition duration-200"
                onClick={() => {
                  // Implementa la lógica para procesar el pago
                }}
                disabled
              >
                Pagar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}