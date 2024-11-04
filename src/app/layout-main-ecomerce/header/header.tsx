'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, X, ShoppingCart } from 'lucide-react';
import logo from "@/img/LOGO.png"
import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "@/app/shared/components/button";
import CartDrawer from '../../public/shoppingCart/components/cart-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/components/dropdown-menu";
import { Input } from "@/app/shared/components/input";

// Define the Product type
type Product = string;

export default function Header() {
  const { data: session, status } = useSession();
  console.log("Session:", session);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const firstName = session?.user?.name?.split(' ')[0] || 'Usuario';
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Ref to track if sesionClient has been called
  const hasCalledSesionClient = useRef(false);

  // Define the fetchSearchResults function using useCallback
  const fetchSearchResults = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/search?query=${searchQuery}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Data received from API:", data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, [searchQuery]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchSearchResults]);

  const scrollToDiscountedProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const discountedProductsSection = document.getElementById('discounted-products');
    if (discountedProductsSection) {
      discountedProductsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignIn = async () => {
    await signIn('google');
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsSidebarOpen(false);
  };

  const sesionClient = useCallback(async () => {
    if (!session) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sesion/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar datos de la sesión', error);
    }
  }, [session]);

  // useEffect para llamar a sesionClient cuando la sesión cambia
  useEffect(() => {
    if (status === "authenticated" && session && !hasCalledSesionClient.current) {
      sesionClient();
      hasCalledSesionClient.current = true; // Evita llamadas repetidas
    }
  }, [session, status, sesionClient]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <header className="bg-[#000080] text-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between lg:justify-start">
          <div className="lg:hidden">
            <Button variant="ghost" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>

          <Link href="/" className="text-2xl font-bold lg:mr-4 order-2 lg:order-1">
            <span className="text-white">COSTA</span>
            <span className="text-[#00BFFF]">DENT</span>
          </Link>

          <div className="hidden lg:flex flex-grow order-3">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {searchResults.map((product, index) => (
                    <Link 
                      href={`/public/productos/todos-los-productos/detalle-productos/${encodeURIComponent(product)}`} 
                      key={index}
                    >
                      <div 
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <div className="font-medium text-black">{product}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4 order-4">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div className="auth-button-container flex items-center space-x-2">
              {session ? (
                <>
                  <Image
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'Usuario'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-white">{firstName}</span>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-[#00BFFF]" 
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#00BFFF]" 
                  onClick={handleSignIn}
                >
                  Iniciar sesión
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              className="text-white hover:text-[#00BFFF]"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="lg:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {searchResults.map((product, index) => (
                  <Link href={`/public/productos/todos-los-productos/detalle-productos/${encodeURIComponent(product)}`} key={index}>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer text-black">
                      <div className="font-medium">{product}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
            
      <nav className="hidden lg:block bg-[#0066CC]">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex justify-between items-center">
            <li>
              <Button variant="ghost" className="text-white hover:text-[#00BFFF]">
                Inicio
              </Button>
            </li>
            <li>
              <a href="/" className="text-white hover:text-[#00BFFF]" onClick={scrollToDiscountedProducts}>
                Ofertas del Día
              </a>
            </li>
            <li>
              <Link href="/public/productos/todos-los-productos" className="text-white hover:text-[#00BFFF]">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/public/soporte-contacto" className="text-white hover:text-[#00BFFF]">
                Soporte al cliente
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
          <div className="fixed top-0 left-0 w-64 h-full bg-[#000080] shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <Image
                  src={logo}
                  alt="COSTADENT Logo"
                  width={50}
                  height={50}
                  priority={true}
                />
                <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <a href="#discounted-products" className="text-white hover:text-[#00BFFF]" onClick={scrollToDiscountedProducts}>
                      Ofertas del Día
                    </a>
                  </li>
                  <li>
                    <Link href="/public/productos/todos-los-productos" className="block py-1 text-white hover:text-[#00BFFF]">
                      Productos
                    </Link>
                  </li>
                  <li>
                    <Link href="/public/soporte-contacto" className="block py-1 text-white hover:text-[#00BFFF]">
                      Soporte al cliente
                    </Link>
                  </li>
                  <li
                  className="text-white hover:text-[#00BFFF] flex items-center w-full justify-start cursor-pointer"
                  onClick={handleCartClick}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCartClick();
                    }
                  }}
                >
                  Carrito
                </li>

                  <li>
                    {session ? (
                      <div className="flex items-center space-x-2 py-2">
                        <Image
                          src={session.user?.image || '/default-avatar.png'}
                          alt={session.user?.name || 'Usuario'}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-white">{firstName}</span>
                        <Button 
                          variant="ghost" 
                          className="text-white hover:text-[#00BFFF]" 
                          onClick={handleSignOut}
                        >
                          Cerrar sesión
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="block py-2 text-white hover:text-[#00BFFF]" 
                        onClick={handleSignIn}
                      >
                        Iniciar sesión
                      </Button>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
    


  );
}