"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "@/app/shared/components/button";
import { Input } from "@/app/shared/components/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

interface Product {
  product_perishable_id: number;
  name: string;
  description: string;
  discount: number;
  category_id: number;
  brand: string;
  images: string[];
  batch_id: number;
  supplier_id: number;
  state: boolean | number;
  price: number ;
  keywords: string ;
  meta_description: string ;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const filteredAndSortedProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearchTerm =
        (product.product_perishable_id?.toString() || "").includes(searchTerm) || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const isActive = product.state === true || product.state === 1;
      const isInactive = product.state === false || product.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredProducts;
    }

    return filteredProducts.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [products, searchTerm, sortOrder, stateFilter]);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <Table className="border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] border-b-0">ID</TableHead>
            <TableHead className="border-b-0">Nombre</TableHead>
            <TableHead className="border-b-0">Precio</TableHead>
            <TableHead className="hidden md:table-cell border-b-0">Descuento</TableHead> 
            <TableHead className="hidden md:table-cell border-b-0">Descripción</TableHead>
            <TableHead className="hidden md:table-cell border-b-0">Marca</TableHead>
            <TableHead className="hidden md:table-cell border-b-0">Palabras clave SEO</TableHead> 
            <TableHead className="hidden md:table-cell border-b-0">Descripción SEO</TableHead> 
            <TableHead className="border-b-0">Estado</TableHead>
            <TableHead className="border-b-0">Imágenes</TableHead>
            <TableHead className="border-b-0">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => {
              const isActive = product.state === true || product.state === 1;

              return (
                <TableRow key={product.product_perishable_id} className={isActive ? '' : 'bg-muted/50'}>
                  <TableCell className="font-medium border-b-0">{product.product_perishable_id}</TableCell>
                  <TableCell className="border-b-0">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.price}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.discount}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.description}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.brand}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.keywords}</TableCell>
                  <TableCell className="hidden md:table-cell border-b-0">{product.meta_description}</TableCell>
                  <TableCell className="border-b-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="border-b-0">
                    {product.images && product.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {product.images.slice(0, 3).map((img, index) => {
                          const fullImageUrl = img;
                          return (
                            <Dialog key={index}>
                              <DialogTrigger>
                                <div className="relative h-10 w-10">
                                  <Image
                                    src={fullImageUrl}
                                    alt={`Imagen ${index + 1} de ${product.name}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md cursor-pointer"
                                  />
                                </div>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{product.name} - Imagen {index + 1}</DialogTitle>
                                </DialogHeader>
                                <div className="relative w-full h-96">
                                  <Image
                                    src={fullImageUrl}
                                    alt={`Imagen de ${product.name} ${index + 1}`}
                                    layout="fill"
                                    objectFit="contain"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          );
                        })}
                        {product.images.length > 3 && (
                          <span className="text-sm text-muted-foreground">+{product.images.length - 3} más</span>
                        )}
                      </div>
                    ) : (
                      "Sin imágenes"
                    )}
                  </TableCell>
                  <TableCell className="border-b-0">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(product.product_perishable_id)}>
                        Editar
                      </Button>
                      <Button
                        className={isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
                        onClick={() => onDelete(product.product_perishable_id)}
                      >
                        {isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center border-b-0">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}