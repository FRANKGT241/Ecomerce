"use client"

import { useState } from 'react'

interface Product {
    id: number
    name: string
    price: number
    quantity: number
}

export default function ShoppingCart() {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Producto A', price: 25.00, quantity: 2 },
        { id: 2, name: 'Producto B', price: 15.50, quantity: 1 },
    ])

    const [showDialog, setShowDialog] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, quantity: 1 })

    const addProductToCart = (e: React.FormEvent) => {
        e.preventDefault()
        const product = { ...newProduct, id: products.length + 1 }
        setProducts([...products, product])
        setNewProduct({ name: '', price: 0, quantity: 1 })
        setShowDialog(false)
    }

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mi Carrito de Compras</h1>
                        <button 
                            onClick={() => setShowDialog(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Agregar Producto
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h2 className="mt-2 text-xl font-semibold text-gray-800">Tu carrito está vacío</h2>
                            <p className="mt-1 text-gray-600">¡Agrega algunos productos para comenzar!</p>
                            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Seguir Comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(product.price * product.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex flex-col items-end gap-4">
                                <div className="text-xl font-bold">
                                    Total: ${calculateTotal()}
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Proceder al Pago
                                </button>
                            </div>
                        </>
                    )}

                    {showDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">Añadir Producto al Carrito</h2>
                                <form onSubmit={addProductToCart}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={newProduct.quantity}
                                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                            min="1"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowDialog(false)}
                                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Añadir al Carrito
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}