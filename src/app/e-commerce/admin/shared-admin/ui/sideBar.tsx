'use client'

import { useState, useEffect } from 'react'
import { X, Home, ChartColumnStacked, BriefcaseBusiness, Boxes, HandCoins, Users2,
    User2, PackageCheck, ShoppingBag, BriefcaseMedical, SmilePlus /*remplazar SmilePlus por icono para Cart*/,
    ClipboardList, /*remplazar SmilePlus por icono para Cart details*/ Bell /*remplazar SmilePlus por icono para reviews*/} from 'lucide-react'



interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div 
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={onClose} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-grow">
            <ul className="py-4">
              {[
                { icon: Home, label: 'Home', href: '/e-commerce/admin' },

                /*VISTAS INICIALES*/
                { icon: ChartColumnStacked, label: 'Categorías ', href: '/e-commerce/admin/pages/categories' },
                { icon: BriefcaseBusiness, label: 'Proveedores', href: '/e-commerce/admin/pages/suppliers' },
                { icon: Boxes, label: 'Lotes', href: '/e-commerce/admin/pages/batches' },
                { icon: HandCoins, label: 'Roles', href: '/e-commerce/admin/pages/roles' },
                { icon: Users2, label: 'Clientes', href: '/e-commerce/admin/pages/clients' },

                /*DEPENDEN DE VISTAS INICIALES (vistas secuandarias)  */
                { icon: User2, label: 'Usuarios', href: '/e-commerce/admin/pages/users' },
                { icon: PackageCheck, label: 'Ordenes', href: '/e-commerce/admin' },
                { icon: ShoppingBag, label: 'Productos perecederos', href: '/e-commerce/admin/pages/products-perishables' },
                { icon: BriefcaseMedical, label: 'Productos no Perecederos', href: '/e-commerce/admin/pages/products-non-perishables' },
                { icon: SmilePlus, label: 'Cart', href: '/e-commerce/admin' },

                /*DEPENDEN DE VISTAS SECUNDARIAS (vistas finales) */
                { icon: ClipboardList, label: 'detalle de orden', href: '/e-commerce/admin' },
                { icon: SmilePlus, label: 'Cart details', href: '/e-commerce/admin' },
                { icon: Bell, label: 'stock notification', href: '/e-commerce/admin' },
                { icon: SmilePlus, label: 'reviews', href: '/e-commerce/admin' },

              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}