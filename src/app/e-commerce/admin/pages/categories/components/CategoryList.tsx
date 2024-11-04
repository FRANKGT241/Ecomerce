"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "@/app/shared/components/button";
import { Input } from "@/app/shared/components/input";

interface Category {
  category_id: number;
  name: string;
  description: string;
  state: boolean | number;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedCategories = useMemo(() => {
    const filteredCategories = categories.filter((category) => {
      const matchesSearchTerm =
        category.category_id.toString().includes(searchTerm) ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const isActive = category.state === true || category.state === 1;
      const isInactive = category.state === false || category.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredCategories;
    }

    return filteredCategories.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [categories, searchTerm, sortOrder, stateFilter]);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="none">Sin ordenar</option>
          <option value="asc">Nombre Ascendente</option>
          <option value="desc">Nombre Descendente</option>
        </select>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedCategories.map((category) => {
            const isActive = category.state === true || category.state === 1;

            return (
              <TableRow key={category.category_id} className={isActive ? '' : 'bg-gray-100'}>
                <TableCell>{category.category_id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || '—'}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => onEdit(category.category_id)}
                  >
                    Editar
                  </Button>
                  <Button
                    className={category.state ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
                    onClick={() => onDelete(category.category_id)}
                  >
                    {category.state ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
