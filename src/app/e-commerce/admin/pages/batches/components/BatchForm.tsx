import { useState, useEffect } from 'react'
import { Button } from "@/app/shared/components/button"
import { Input } from "@/app/shared/components/input"
import { Label } from "@/app/shared/components/label"

type BatchFormProps = {
  onSubmit: (data: any) => void
  initialData?: any
}

export function BatchForm({ onSubmit, initialData }: BatchFormProps) {
  const [formData, setFormData] = useState({
    quantity: '',
    expiration_date: '',
    notification_date: '',
    code_batch : '',
    manufacturing_date: ''
  })

 
  useEffect(() => {
    if (initialData) {
      setFormData({
        quantity: initialData.quantity || '',
        code_batch: initialData.code_batch || '',
        expiration_date: initialData.expiration_date || '',
        notification_date: initialData.notification_date || '',
        manufacturing_date: initialData.manufacturing_date || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="quantity">Código de lote</Label>
        <Input
          id="code_batch"
          name="code_batch"
          type="string"
          value={formData.code_batch}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="expiration_date">Fecha de expiracion</Label>
        <Input
          id="expiration_date"
          name="expiration_date"
          type="date"
          value={formData.expiration_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="notification_date">Fecha de notificacion</Label>
        <Input
          id="notification_date"
          name="notification_date"
          type="date"
          value={formData.notification_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="manufacturing_date">Fecha de creacion</Label>
        <Input
          id="manufacturing_date"
          name="manufacturing_date"
          type="date"
          value={formData.manufacturing_date}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
