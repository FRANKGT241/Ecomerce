'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"


// Simulated purchase history data with updated structure
const purchaseHistory = [
  { 
    id: "ORD12345", 
    date: "2023-05-15", 
    products: [
      { name: "Producto A", quantity: 2, price: 50.00 },
      { name: "Producto B", quantity: 1, price: 75.00 }
    ], 
    total: 175.00, 
    status: "Entregado",
    paymentMethod: "Tarjeta de crédito"
  },
  { 
    id: "ORD12346", 
    date: "2023-06-02", 
    products: [
      { name: "Producto C", quantity: 3, price: 25.00 }
    ], 
    total: 75.00, 
    status: "En Reparto",
    paymentMethod: "PayPal"
  },
  { 
    id: "ORD12347", 
    date: "2023-06-10", 
    products: [
      { name: "Producto A", quantity: 1, price: 50.00 },
      { name: "Producto D", quantity: 2, price: 100.00 }
    ], 
    total: 250.00, 
    status: "Procesando",
    paymentMethod: "Transferencia bancaria"
  },
  { 
    id: "ORD12348", 
    date: "2023-06-15", 
    products: [
      { name: "Producto B", quantity: 2, price: 75.00 },
      { name: "Producto C", quantity: 1, price: 25.00 },
      { name: "Producto E", quantity: 1, price: 150.00 }
    ], 
    total: 325.00, 
    status: "Enviado",
    paymentMethod: "Tarjeta de débito"
  },
  { 
    id: "ORD12349", 
    date: "2023-06-20", 
    products: [
      { name: "Producto F", quantity: 1, price: 50.00 }
    ], 
    total: 50.00, 
    status: "Cancelado",
    paymentMethod: "Efectivo"
  },
]

export function HistorialComprasComponent() {
  const [searchTerm, setSearchTerm] = useState("''")

  const filteredHistory = purchaseHistory.filter(purchase =>
    purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    purchase.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white">
      <CardHeader className="border-b border-[#565656]/20">
        <CardTitle className="text-2xl font-bold text-center text-[#0e0ea9]" style={{ fontFamily: "'Uni Neue, sans-serif'" }}>
          Historial de Compras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-4">
          <Input
            type="text"
            placeholder="Buscar por número de pedido, producto o método pago"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-[#565656]/20 focus:ring-[#009eff]"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nº Pedido</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Método de Pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>{purchase.id}</TableCell>
                <TableCell>
                  {purchase.products.map((product, index) => (
                    <div key={index}>
                      {product.quantity}x {product.name} - Q{product.price.toFixed(2)}
                    </div>
                  ))}
                </TableCell>
                <TableCell>Q{purchase.total.toFixed(2)}</TableCell>
                <TableCell>{purchase.paymentMethod}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      purchase.status === "Entregado" ? "default" :
                      purchase.status === "En Reparto" ? "secondary" :
                      purchase.status === "Procesando" ? "outline" :
                      purchase.status === "Enviado" ? "default" :
                      "destructive"
                    }
                  >
                    {purchase.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}