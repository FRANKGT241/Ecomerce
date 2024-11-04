import { useState, useEffect } from 'react'
import { Button } from "@/app/shared/components/button"
import { Input } from "@/app/shared/components/input"
import { Label } from "@/app/shared/components/label"

type RoleFormProps = {
  onSubmit: (data: any) => void
  initialData?: any
}

export function RoleForm({ onSubmit, initialData }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    state: true, // estado por defecto como activo
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        state: initialData.state !== undefined ? initialData.state : true,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, state: e.target.checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del rol</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
        />
      </div>
      <div className="flex items-center">
        <Label htmlFor="state">Activo</Label>
        <input
          id="state"
          name="state"
          type="checkbox"
          checked={formData.state}
          onChange={handleCheckboxChange}
          className="ml-2"
        />
      </div>
      <Button type="submit">Guardar</Button>
    </form>
  )
}
