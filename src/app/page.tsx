'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/app/shared/components/card";
import { Badge } from "@/app/shared/components/badge";
import { Button } from "@/app/shared/components/button";
import { ShoppingCart, Star, Plus } from "lucide-react";
import CartDrawer from './public/shoppingCart/components/cart-drawer';
import { Input } from "@/app/shared/components/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from "@/app/shared/components/dialog";

interface Product {
  product_perishable_id?: number;
  product_non_perishable_id?: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  stock?: number;
  images: string[];
  Category: { name: string };
  Batch?: { quantity: number };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantity_ordered, setQuantityOrdered] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const discountCarouselRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/productsInterest`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductsWithDiscount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/productsDiscount`);
      const data = await response.json();
      setDiscountProducts(data);
    } catch (error) {
      console.error('Error fetching products with discount:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.product_non_perishable_id || product.product_perishable_id,  
          quantity_ordered: quantity_ordered,
          id_client: 1,
          type: product.product_non_perishable_id ? 'non-perishable' : 'perishable'
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding product to cart');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductsWithDiscount();
  }, []);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const renderProductCard = (product: Product, isDiscounted: boolean = false) => (
    <Link href={`/public/productos/todos-los-productos/detalle-productos/${encodeURIComponent(product.name)}`} className="block" key={product.name}>
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer w-[300px]">
        <div className="relative h-48 w-full">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {isDiscounted && product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-[#00BFFF]">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <h2 className="text-xl font-semibold mb-2 line-clamp-1 text-[#000080]">{product.name}</h2>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#00BFFF] text-[#00BFFF]" />
            ))}
            <span className="text-sm text-gray-600 ml-2">(5.0)</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-[#000080]">
              {renderPrice(product.price)}
            </span>
            <p className="text-sm text-gray-500">
              Disponible: {product.Batch?.quantity || product.stock || 0}
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-[#00BFFF] hover:bg-[#0099CC] text-white"
            onClick={(e) => {
              e.preventDefault();
              setSelectedProduct(product);
              setIsQuantityDialogOpen(true);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Añadir al carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );

  const renderPrice = (price: number | string | null | undefined) => {
    if (typeof price === 'number') {
      return `Q ${price.toFixed(2)}`;
    } else if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? 'Precio no disponible' : `Q ${numPrice.toFixed(2)}`;
    } else {
      return 'Precio no disponible';
    }
  };

  const renderSeeMoreCard = () => (
    <Link href="/public/productos/todos-los-productos">
      <Card className="overflow-hidden flex flex-col justify-center items-center hover:shadow-lg transition-shadow duration-300 bg-gray-100 h-full w-[300px]">
        <CardContent className="p-4 flex-grow flex flex-col justify-center items-center">
          <Plus className="w-16 h-16 text-[#000080] mb-4" />
          <h2 className="text-xl font-semibold text-center text-[#000080]">VER MAS PRODUCTOS</h2>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center text-[#000080] mb-6">Productos que te pueden interesar</h1>

      <div className="relative">
        <button
          className="hidden sm:flex absolute left-32 top-1/2 transform -translate-y-1/2 bg-[#00BFFF] text-white px-4 py-5 rounded-lg z-10 shadow-lg items-center justify-center text-[30px] hover:bg-[#0099CC] transition duration-300"
          onClick={() => scrollLeft(carouselRef)}
        >
          &#8249;
        </button>
        <div
          ref={carouselRef}
          className="container mx-auto grid grid-flow-col auto-cols-[minmax(300px,_1fr)] gap-8 overflow-x-scroll no-scrollbar"
        >
          {products.length > 0 ? (
            <>
              {products.map((product) => renderProductCard(product))}
              {renderSeeMoreCard()}
            </>
          ) : (
            <p className="text-center text-gray-600">Cargando productos...</p>
          )}
        </div>
        <button
          className="hidden sm:flex absolute right-32 top-1/2 transform -translate-y-1/2 bg-[#00BFFF] text-white px-4 py-5 rounded-lg z-10 shadow-lg items-center justify-center text-[30px] hover:bg-[#0099CC] transition duration-300"
          onClick={() => scrollRight(carouselRef)}
        >
          &#8250;
        </button>
      </div>

      <h1 id="discounted-products" className="text-3xl font-bold text-center text-[#000080] mb-6 mt-12">Productos con Descuento</h1>

      <div className="relative">
        <button
          className="hidden sm:flex absolute left-32 top-1/2 transform -translate-y-1/2 bg-[#00BFFF] text-white px-4 py-5 rounded-lg z-10 shadow-lg items-center justify-center text-[30px] hover:bg-[#0099CC] transition duration-300"
          onClick={() => scrollLeft(discountCarouselRef)}
        >
          &#8249;
        </button>
        <div
          ref={discountCarouselRef}
          className="container mx-auto grid grid-flow-col auto-cols-[minmax(300px,_1fr)] gap-8 overflow-x-scroll no-scrollbar"
        >
          {discountProducts.length > 0 ? (
            <>
              {discountProducts.map((product) => renderProductCard(product, true))}
              {renderSeeMoreCard()}
            </>
          ) : (
            <p className="text-center text-gray-600">Cargando productos con descuento...</p>
          )}
        </div>
        <button
          className="hidden sm:flex absolute right-32 top-1/2 transform -translate-y-1/2 bg-[#00BFFF] text-white px-4 py-5 rounded-lg z-10 shadow-lg items-center justify-center text-[30px] hover:bg-[#0099CC] transition duration-300"
          onClick={() => scrollRight(discountCarouselRef)}
        >
          &#8250;
        </button>
      </div>

      <Dialog open={isQuantityDialogOpen} onOpenChange={setIsQuantityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Añadir al carrito</DialogTitle>
          {selectedProduct && (
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="col-span-1">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      width={120}
                      height={120}
                      className="rounded-md object-cover"
                    />

                ) : (
                  <div className="w-[120px] h-[120px] bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <p className="font-bold text-lg mt-2">{renderPrice(selectedProduct.price)}</p>
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <DialogDescription>
              Seleccione la cantidad del producto que desea agregar al carrito
            </DialogDescription>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                const maxQuantity = selectedProduct?.stock || selectedProduct?.Batch?.quantity || 1;
                
                if (isNaN(value) || value < 1) {
                  setQuantity(1);
                  setQuantityOrdered(1);
                } else if (value > maxQuantity) {
                  setQuantity(maxQuantity);
                  setQuantityOrdered(maxQuantity);
                } else {
                  setQuantity(value);
                  setQuantityOrdered(value);
                }
              }}
              min={1}
              max={selectedProduct?.stock || selectedProduct?.Batch?.quantity || 1}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQuantityDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => {
              if (selectedProduct) {
                addToCart(selectedProduct, quantity_ordered);
                setIsQuantityDialogOpen(false);
              }
            }}>
              Añadir al carrito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}