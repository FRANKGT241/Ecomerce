"'use client'"

import { Button } from "@/app/shared/components/button"
import { Input } from "@/app/shared/components/input"
import { Label } from "@/app/shared/components/label"
import { Textarea } from "@/app/shared/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/shared/components/select"
import { Badge } from "@/app/shared/components/badge"
import { CalendarIcon, ShoppingBag, Upload } from "lucide-react"

export function CreateProduct() {
  return (


      
      <main className="p-4 pb-20">
        <h2 className="text-lg font-semibold mb-4">CREAR PRODUCTO</h2>
        
        <form className="space-y-4">
          <div>
            <Label htmlFor="title">Título del producto</Label>
            <Input id="title" placeholder="Ingresar título" />
          </div>
          
          <div>
            <Label htmlFor="description">Descripción del producto</Label>
            <Textarea id="description" placeholder="Ingresar Descripción" className="h-24" />
          </div>
          
          <div>
            <Label htmlFor="visibility">Visibilidad</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Publicado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Categoría 1</SelectItem>
                <SelectItem value="category2">Categoría 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Ortodoncia <span className="ml-1 cursor-pointer">×</span></Badge>
              <Input placeholder="Agregar etiqueta" className="flex-grow" />
            </div>
          </div>
          
          <div>
            <Label>Fotografías</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center">
              <Upload className="mx-auto w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Subir fotos</p>
            </div>
          </div>
          
          {["Fabricante", "Marca", "Stock", "Unidades mínimas", "Precio", "Descuento", "Lote"].map((label) => (
            <div key={label}>
              <Label htmlFor={label.toLowerCase()}>{label}</Label>
              <Input id={label.toLowerCase()} placeholder={`Ingresar ${label.toLowerCase()}`} />
            </div>
          ))}
          
          {["Título SEO", "Keywords SEO", "Descripción SEO"].map((label) => (
            <div key={label}>
              <Label htmlFor={label.toLowerCase().replace("", "-")}>{label}</Label>
              <Input id={label.toLowerCase().replace("", "-")} placeholder={`Ingresar ${label.toLowerCase()}`} />
            </div>
          ))}
          
          {["Fecha publicación", "Fecha actualización"].map((label) => (
            <div key={label}>
              <Label htmlFor={label.toLowerCase().replace("", "-")}>{label}</Label>
              <div className="relative">
                <Input id={label.toLowerCase().replace("", "-")} type="date" defaultValue="2002-09-09" />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
          
          <Button className="w-full bg-blue-500 hover:bg-blue-600">Guardar</Button>
        </form>
      </main>
      


  )
}