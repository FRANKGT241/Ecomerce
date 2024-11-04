"use client";

import React, { useState, useEffect } from "react";
import { ProductForm } from "./components/product-non-perisahble-form";
import { ProductTable } from "./components/product-non-perisahble-list";
import { Button } from "@/app/shared/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

interface Product {
  product_non_perishable_id: number;
  name: string;
  description: string;
  price: number; // Añadimos el campo de precio aquí
  discount: number;
  category_id: number;
  brand: string;
  images: string[];
  stock: number;
  supplier_id: number;
  state: boolean | number;
  keywords: string ;
  meta_description: string ;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "No se encontró un token. Por favor, inicia sesión.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products_non_perishables`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los productos");

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los productos",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "No se encontró un token. Por favor, inicia sesión.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products_non_perishables`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) throw new Error("Error al crear producto");

      fetchProducts();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "No se encontró un token. Por favor, inicia sesión.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products_non_perishables/${editingProduct?.product_non_perishable_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) throw new Error("Error al actualizar producto");

      fetchProducts();
      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const handleChangeStatus = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "No se encontró un token. Por favor, inicia sesión.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products_non_perishables/${productId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cambiar el estado del producto");

      fetchProducts();
    } catch (error) {
      console.error("Error changing product status:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del producto",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (productId: number) => {
    const productToEdit = products.find((product) => product.product_non_perishable_id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos No Perecederos</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4" onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}>
            Crear Producto
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Producto" : "Crear Producto"}</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={editingProduct ? handleEdit : handleCreate} 
            initialData={editingProduct} 
          />
        </DialogContent>
      </Dialog>

      <ProductTable
        products={products}
        onEdit={handleEditClick}
        onDelete={handleChangeStatus} 
      />
    </div>
  );
}
