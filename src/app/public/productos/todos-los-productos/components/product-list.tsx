'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/app/shared/components/card";
import { Badge } from "@/app/shared/components/badge";
import { Button } from "@/app/shared/components/button";
import { Skeleton } from "@/app/shared/components/skeleton";
import { ShoppingCart, Star } from "lucide-react";
import { ProductFilters } from '@/app/shared/components/product-filters';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from "@/app/shared/components/dialog";
import { Input } from "@/app/shared/components/input";
import { useSession, signIn } from "next-auth/react"; // Importar useSession y signIn

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

interface ProductListClientProps {
  initialProducts: Product[]
}

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
  const { data: session, status } = useSession(); // Obtener la sesión del usuario
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showInStock, setShowInStock] = useState(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantity_ordered, setQuantityOrdered] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para el diálogo de alerta
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const addToCart = async (product: Product, quantity: number) => {
    if (!session) {
      setAlertMessage("Debes iniciar sesión para añadir productos al carrito.");
      setIsAlertDialogOpen(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.product_non_perishable_id || product.product_perishable_id,  
          quantity_ordered: quantity_ordered,
          email: session.user?.email || 1, // Asegúrate de que el ID del cliente esté en la sesión
          type: product.product_non_perishable_id ? 'non-perishable' : 'perishable'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir el producto al carrito');
      }

      const data = await response.json();
      console.log('Producto añadido al carrito:', data);
      setAlertMessage("Producto añadido al carrito con éxito.");
      setIsAlertDialogOpen(true);
    } catch (error) {
    }
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Productos obtenidos:', data);
      const productsWithParsedPrices = data.map((product: Product) => ({
        ...product,
        price: product.price !== null ? parseFloat(product.price.toString()) : null
      }));
      setProducts(productsWithParsedPrices);
      setFilteredProducts(productsWithParsedPrices);
      const prices = productsWithParsedPrices
        .map((product: Product) => product.price)
        .filter((price: number | null): price is number => price !== null);
      if (prices.length > 0) {
        setPriceRange([0, Math.max(...prices)]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Ocurrió un error al cargar los productos'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 5 * 60 * 1000); // Refrescar cada 5 minutos
    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map((product: Product) => product.Category.name)));
    setCategories(uniqueCategories);
    const uniqueBrands = Array.from(new Set(products.map((product: Product) => product.brand)));
    setBrands(uniqueBrands);
  }, [products]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.Category.name);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const priceMatch = product.price !== null && product.price >= priceRange[0] && product.price <= priceRange[1];
      const stockMatch = !showInStock || (product.Batch?.quantity || product.stock || 0) > 0;
      return categoryMatch && brandMatch && priceMatch && stockMatch;
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategories, selectedBrands, priceRange, showInStock]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const renderPrice = (price: string | number | null) => {
    if (price === null || price === undefined) {
      return 'Precio no disponible';
    }
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `Q ${numericPrice.toFixed(2)}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-[#000080]">Error</h2>
            <p className="text-center text-gray-600">Error al cargar los productos: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#000080]">Nuestros Productos</h1>
        <Button
          variant="ghost"
          className="text-white hover:text-[#00BFFF] flex items-center"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6 mr-2" />
          Carrito
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <ProductFilters
            categories={categories}
            selectedCategories={selectedCategories}
            brands={brands}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            showInStock={showInStock}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onPriceRangeChange={setPriceRange}
            onShowInStockChange={setShowInStock}
          />
        </div>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : filteredProducts.map((product) => (
                  <Card key={product.name} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer w-full">
                    <Link href={`/public/productos/todos-los-productos/detalle-productos/${encodeURIComponent(product.name)}`} className="block">
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
                        {product.discount > 0 && (
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
                    </Link>
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
                          if (session) {
                            setSelectedProduct(product);
                            setIsQuantityDialogOpen(true);
                          } else {
                            setAlertMessage("Debes iniciar sesión para añadir productos al carrito.");
                            setIsAlertDialogOpen(true);
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Añadir al carrito
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      </div>

      {/* Diálogo para seleccionar cantidad */}
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
                <p className="text-sm text-gray-500">{selectedProduct.description}</p>
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

      {/* Diálogo de Alerta */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Información</DialogTitle>
          <DialogDescription>
            {alertMessage}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsAlertDialogOpen(false)}>Cerrar</Button>
            {!session && (
              <Button
                onClick={() => {
                  setIsAlertDialogOpen(false);
                  signIn(); // Iniciar el flujo de inicio de sesión
                }}
                className="ml-2 bg-[#00BFFF] text-white hover:bg-[#0099CC]"
              >
                Iniciar sesión
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
