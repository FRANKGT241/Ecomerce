"use client";

import { useState } from "react";
import { useToast } from './ui/use-toast';
import { Mail, Phone, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";

export default function SoporteContactoPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: false, email: false });

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setErrors({ ...errors, email: !validateEmail(value) });
    }
    if (name === 'name') {
      setErrors({ ...errors, name: value.length === 0 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email) || formData.name === '') {
      toast({
        title: "Error en el formulario",
        description: (
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" />
            Por favor revisa los campos obligatorios.
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensaje enviado correctamente",
      description: (
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2" />
          El mensaje ha sido enviado correctamente
        </div>
      ),
    });      
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-[#000080]">Soporte de Contacto</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg mb-12">
        <h2 className="text-2xl font-semibold text-[#000080] mb-4">Envíanos un mensaje</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] sm:text-sm`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">El nombre es obligatorio.</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] sm:text-sm`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Ingresa un correo electrónico válido.</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] "
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#00BFFF] hover:bg-[#0099CC] text-white px-4 py-2 rounded-md shadow-md transition-colors duration-300 w-full sm:w-auto"
          >
            Enviar
          </button>
        </div>
      </form>

      <div className="max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#000080]">
          Preguntas Frecuentes <HelpCircle className="inline-block text-[#00BFFF] ml-2" />
        </h2>
        <ul className="space-y-4">
          <li className="bg-white p-4 shadow-md rounded-md hover:bg-gray-50 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-[#000080]">¿Cómo puedo rastrear mi pedido?</h3>
            <p className="text-gray-600">Puedes rastrear tu pedido desde la sección de &quot;Mi cuenta&quot; o a través del enlace que te enviamos por correo al realizar la compra.</p>
          </li>
          <li className="bg-white p-4 shadow-md rounded-md hover:bg-gray-50 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-[#000080]">¿Cómo puedo devolver un producto?</h3>
            <p className="text-gray-600">Puedes iniciar el proceso de devolución desde &quot;Mi cuenta&quot; o contactando directamente a nuestro equipo de soporte.</p>
          </li>
          <li className="bg-white p-4 shadow-md rounded-md hover:bg-gray-50 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-[#000080]">¿Cómo me comunico con el soporte técnico?</h3>
            <p className="text-gray-600">Puedes enviarnos un mensaje a través del formulario de contacto o llamarnos al número de soporte proporcionado abajo.</p>
          </li>
        </ul>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[#000080]">Otros Métodos de Contacto</h2>
        <div className="flex justify-center items-center space-x-8">
          <div className="text-center">
            <Mail className="text-[#00BFFF] mx-auto" size={32} />
            <p className="text-gray-600 mt-2">soporte@ejemplo.com</p>
          </div>
          <div className="text-center">
            <Phone className="text-[#00BFFF] mx-auto" size={32} />
            <p className="text-gray-600 mt-2">+1 (800) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
