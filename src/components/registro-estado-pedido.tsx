"'use client'"

import { useState } from "'react'"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Simulated function to update order status
const actualizarEstadoPedido = async (idPedido: string, nuevoEstado: string, comentarios: string) => {
  // In a real application, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`Pedido ${idPedido} actualizado a estado: ${nuevoEstado}. Comentarios: ${comentarios}`)
  return { success: true }
}

export function RegistroEstadoPedidoComponent() {
  const [idPedido, setIdPedido] = useState("''")
  const [nuevoEstado, setNuevoEstado] = useState("''")
  const [comentarios, setComentarios] = useState("''")
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idPedido || !nuevoEstado) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setCargando(true)
    try {
      const resultado = await actualizarEstadoPedido(idPedido, nuevoEstado, comentarios)
      if (resultado.success) {
        toast({
          title: "Éxito",
          description: "El estado del pedido ha sido actualizado correctamente.",
        })
        // Reset form
        setIdPedido("''")
        setNuevoEstado("''")
        setComentarios("''")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el estado del pedido.",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader className="border-b border-[#565656]/20">
        <CardTitle className="text-2xl font-bold text-center text-[#0e0ea9]" style={{ fontFamily: "'Uni Neue, sans-serif'" }}>
          Registro de Estado de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={manejarEnvio} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="idPedido">ID del Pedido</Label>
            <Input
              id="idPedido"
              type="text"
              placeholder="Ingrese ID del Pedido (ej: ORD12345)"
              value={idPedido}
              onChange={(e) => setIdPedido(e.target.value)}
              className="border-[#565656]/20 focus:ring-[#009eff]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nuevoEstado">Nuevo Estado</Label>
            <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
              <SelectTrigger className="border-[#565656]/20 focus:ring-[#009eff]">
                <SelectValue placeholder="Seleccione el nuevo estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Procesando">Procesando</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="En Reparto">En Reparto</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentarios (opcional)</Label>
            <Textarea
              id="comentarios"
              placeholder="Añada comentarios adicionales aquí"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="border-[#565656]/20 focus:ring-[#009eff]"
            />
          </div>

          <Button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-[#009eff] hover:bg-[#0e0ea9] text-white transition-colors"
          >
            {cargando ? "'Actualizando...'" : "'Actualizar Estado'"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}