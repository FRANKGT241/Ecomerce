'use client'

import { Home, User, ShoppingCart, Mail, MessageSquare, Facebook, Instagram, Twitter, Phone, Linkedin, Twitch, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full">

      {/* Main Footer Content */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
          {/* App Section */}
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Image 
                src="/img/LOGO.png" 
                alt="Costa Dent Logo" 
                width={100} 
                height={100} 
                className="mb-4 object-contain"
              />
              <p className="text-lg font-semibold text-blue-600">COSTADENT</p>
              <p className="text-sm">Tu mejor opción en productos dentales de calidad y confianza</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <div className="space-y-3">
              <Link href="#" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700">
                <Phone className="h-5 w-5" />
                <span>Comunicarse a una tienda</span>
              </Link>
              <Link href="mailto:info@costadent.com" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700">
                <Mail className="h-5 w-5" />
                <span>info@costadent.com</span>
              </Link>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="text-center">
              <div className="flex flex-col items-center">
                <Image 
                  src="/img/LOGO.png" 
                  alt="Feedback Icon" 
                  width={100} 
                  height={100} 
                  className="mb-4 object-contain"
                />
                <p className="text-sm">¿Cómo ha sido tu experiencia con el sitio?</p>
                <p className="text-sm text-blue-600">Danos tu opinión acerca de nuestro sitio web</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center mt-12">
            <p className="mb-4">Síguenos en nuestras redes</p>
            <p className="text-blue-600 mb-6">#TecnologíaParaTuSonrisa</p>
            <div className="flex justify-center gap-6">
              <Link 
                href="https://facebook.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link 
                href="https://instagram.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link 
                href="https://twitter.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link 
                href="https://whatsapp.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-6 w-6" />
              </Link>
              <Link 
                href="https://www.linkedin.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center gap-6 mt-8">
            <Image 
              src="/img/paypal.png" 
              alt="Paypal" 
              width={80} 
              height={30} 
              className="object-contain"
            />
            <Image 
              src="/img/visa.png" 
              alt="Visa" 
              width={70} 
              height={30} 
              className="object-contain"
            />
            <Image 
              src="/img/master.png" 
              alt="Mastercard" 
              width={60} 
              height={30} 
              className="object-contain"
            />
          </div>

          {/* Legal */}
          <div className="text-center text-sm mt-8 space-y-4">
            <p className="text-gray-600">
            Todas las imágenes mostradas son de carácter ilustrativo. Los nombres comerciales de productos son propiedad de sus respectivas marcas.
            La venta de los productos online está sujeta a verificación de stock. Los precios y cuotas bancarias en COSTADENT así como la información del sitio, están sujetos a cambios sin previo aviso.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/public/politica-empresa?page=terminos-condiciones" className="text-blue-600 hover:underline">
                Términos y condiciones
              </Link>
              <Link href="/public/politica-empresa?page=politicas-privacidad" className="text-blue-600 hover:underline">
                Política de privacidad
              </Link>
            </div>

            <p className="text-gray-600">Copyright © 1989-2024 COSTADENT S.A. (By Francisco Manuel & Mendelssohn Torres) Todos los derechos reservados.</p>
            <p className="text-gray-500">Versión 1.0.2</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
