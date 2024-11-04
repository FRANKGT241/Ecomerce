"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/shared/components/button";
import { Input } from "@/app/shared/components/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/shared/components/accordion";
import { Skeleton } from "@/app/shared/components/skeleton";

interface Product {
  id: number;
  name: string;
  description: string;
  discount: string;
  brand: string;
  images: string[];
  price: number | null;
  category: string;
  keywords: string | null;
  meta_description: string | null;
  quantity?: number;
  stock?: number;
  batch?: number;
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    // Ensure slug is a string
    const slugValue = Array.isArray(slug) ? slug[0] : slug;

    if (!slugValue) {
      setError(new Error('Slug is missing'));
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/data/products`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product[] = await response.json();
        const foundProduct = data.find(
          (p: Product) => p.name === decodeURIComponent(slugValue)
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error('Producto no encontrado');
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (product?.images.length ?? 0) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (product?.images.length ?? 1) - 1 : prevIndex - 1
    );
  };

  const discountedPrice =
    product?.price && product.discount
      ? product.price * (1 - parseFloat(product.discount) / 100)
      : product?.price;

  if (error) return <div>Error al cargar el producto: {error.message}</div>;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="relative mb-4">
            <Skeleton className="w-full h-[600px] rounded-lg" />
            <div className="flex gap-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="relative mb-4">
          {product.images && product.images.length > 0 && (
            <>
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg"
                priority={currentImageIndex === 0} // Carga prioritariamente la primera imagen
              />
              <Button
                variant="outline"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          <div className="flex gap-2 mt-4">
            {product.images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Thumbnail ${index + 1}`}
                width={500}
                height={500}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                  index === currentImageIndex ? "border-2 border-sky-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
                loading="lazy" // Carga diferida para imágenes en miniatura
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold">
              Q {discountedPrice ? discountedPrice.toFixed(2) : '0.00'}
            </span>
            {product.discount && parseFloat(product.discount) > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through">
                Q {typeof product.price === "number" ? product.price.toFixed(2) : '0.00'}
                </span>
                <span className="text-lg text-sky-500 font-semibold">
                  {product.discount}% Descuento
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white mb-4">
            Agregar al carrito
          </Button>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="description">
              <AccordionTrigger>Descripción</AccordionTrigger>
              <AccordionContent>{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
              <AccordionTrigger>Detalles del producto</AccordionTrigger>
              <AccordionContent>
                <p>Marca: {product.brand}</p>
                <p>Categoría: {product.category}</p>
                <p>
                  Disponible: {product.batch || product.stock || product.quantity || 0}
                </p>
                {product.keywords && <p>Palabras clave: {product.keywords}</p>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}