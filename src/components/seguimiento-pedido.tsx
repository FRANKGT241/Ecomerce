"'use client'"

import { useState } from "'react'"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Truck, Package, Home } from "'lucide-react'"

// Datos de ejemplo de pedidos
const pedidosEjemplo = {
  "'ORD12345'": {
    estado: "'Enviado'",
    productos: [
      { nombre: "'Escaler Dental'", cantidad: 2 },
      { nombre: "'Mascarillas Desechables'", cantidad: 100 }
    ],
    direccionEnvio: "'Calle Principal 123, Ciudad Example, 12345'",
    entregaEstimada: "'15/06/2023'"
  },
  "'ORD67890'": {
    estado: "'Procesando'",
    productos: [
      { nombre: "'Sillón Dental'", cantidad: 1 },
      { nombre: "'Lámpara LED de Curado'", cantidad: 2 }
    ],
    direccionEnvio: "'Avenida Central 456, Ciudad Example, 67890'",
    entregaEstimada: "'20/06/2023'"
  },
  "'ORD11111'": {
    estado: "'Entregado'",
    productos: [
      { nombre: "'Kit de Implantes Dentales'", cantidad: 1 },
      { nombre: "'Bolsas de Esterilización'", cantidad: 200 }
    ],
    direccionEnvio: "'Calle Roble 789, Ciudad Example, 11111'",
    entregaEstimada: "'10/06/2023'"
  },
  "'ORD22222'": {
    estado: "'En Reparto'",
    productos: [
      { nombre: "'Máquina de Rayos X Dental'", cantidad: 1 },
      { nombre: "'Material de Impresión Dental'", cantidad: 5 }
    ],
    direccionEnvio: "'Avenida Pino 321, Ciudad Example, 22222'",
    entregaEstimada: "'12/06/2023'"
  }
}

const obtenerEstadoPedido = async (idPedido: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const pedido = pedidosEjemplo[idPedido]
  if (!pedido) {
    throw new Error("'ID de pedido inválido'")
  }
  return { ...pedido, idPedido }
}

export function SeguimientoPedidoComponent() {
  const [idPedido, setIdPedido] = useState("''")
  const [detallesPedido, setDetallesPedido] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setDetallesPedido(null)

    try {
      const resultado = await obtenerEstadoPedido(idPedido)
      setDetallesPedido(resultado)
    } catch (err) {
      setError("'ID de pedido inválido. Por favor, intente nuevamente.'")
    } finally {
      setCargando(false)
    }
  }

  const obtenerIndiceEstado = (estado: string) => {
    const estados = ["'Procesando'", "'Enviado'", "'En Reparto'", "'Entregado'"]
    return estados.indexOf(estado)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader className="border-b border-[#565656]/20">
        <CardTitle className="text-2xl font-bold text-center text-[#0e0ea9]" style={{ fontFamily: "'Uni Neue, sans-serif'" }}>
          Seguimiento de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={manejarEnvio} className="space-y-4 mt-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Ingrese ID del Pedido (ej: ORD12345)"
              value={idPedido}
              onChange={(e) => setIdPedido(e.target.value)}
              className="flex-grow border-[#565656]/20 focus:ring-[#009eff]"
            />
            <Button 
              type="submit" 
              disabled={cargando}
              className="bg-[#009eff] hover:bg-[#0e0ea9] text-white transition-colors"
            >
              {cargando ? "'Buscando...'" : "'Buscar'"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {detallesPedido && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#0e0ea9]">
                Estado del Pedido: {detallesPedido.estado}
              </h3>
              <div className="flex justify-between items-center mb-4">
                {["'Procesando'", "'Enviado'", "'En Reparto'", "'Entregado'"].map((estado, index) => (
                  <div key={estado} className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${
                      index <= obtenerIndiceEstado(detallesPedido.estado) 
                        ? "'bg-[#009eff]'" 
                        : "'bg-[#565656]/20'"
                    }`}>
                      {estado === "'Procesando'" && <Package className="w-6 h-6 text-white" />}
                      {estado === "'Enviado'" && <Truck className="w-6 h-6 text-white" />}
                      {estado === "'En Reparto'" && <Truck className="w-6 h-6 text-white" />}
                      {estado === "'Entregado'" && <Home className="w-6 h-6 text-white" />}
                    </div>
                    <p className="text-xs mt-2 text-center text-[#565656]">{estado}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-[#565656]/20 rounded-full mb-6">
                <div 
                  className="h-full bg-[#009eff] rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(obtenerIndiceEstado(detallesPedido.estado) + 1) * 25}%` }}
                ></div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#0e0ea9]">ID del Pedido:</h4>
                  <p className="text-[#565656]">{detallesPedido.idPedido}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0e0ea9]">Productos:</h4>
                  <ul className="list-disc list-inside text-[#565656]">
                    {detallesPedido.productos.map((item, index) => (
                      <li key={index}>{item.nombre} (Cantidad: {item.cantidad})</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0e0ea9]">Dirección de Envío:</h4>
                  <p className="text-[#565656]">{detallesPedido.direccionEnvio}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0e0ea9]">Entrega Estimada:</h4>
                  <p className="text-[#565656]">{detallesPedido.entregaEstimada}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}