import { useState, useEffect } from 'react'
import { Button } from "@/app/shared/components/button"
import { Input } from "@/app/shared/components/input"
import { Label } from "@/app/shared/components/label"

type UserFormProps = {
  onSubmit: (data: any) => void
  initialData?: any
  roles: { role_id: number; name: string }[]
}

export function UserForm({ onSubmit, initialData, roles }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
    state: true,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        password: '', // Don't set the password for editing
        role_id: initialData.role_id?.toString() || '',
        state: initialData.state !== undefined ? initialData.state : true,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="first_name">Nombre</Label>
        <Input
          id="first_name"
          name="first_name"
          type="text"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">Apellido</Label>
        <Input
          id="last_name"
          name="last_name"
          type="text"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!initialData}
        />
      </div>
      <div>
        <Label htmlFor="role_id">Rol</Label>
        <select
          id="role_id"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          className="block w-full mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_id} - {role.name}
            </option>
          ))}
        </select>
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