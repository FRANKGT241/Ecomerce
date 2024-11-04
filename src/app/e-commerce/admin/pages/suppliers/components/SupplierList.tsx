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

interface Supplier {
  supplier_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  state: boolean | number;
}

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedSuppliers = useMemo(() => {
    const filteredSuppliers = suppliers.filter((supplier) => {
      const matchesSearchTerm =
        supplier.supplier_id.toString().includes(searchTerm) ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

      const isActive = supplier.state === true || supplier.state === 1;
      const isInactive = supplier.state === false || supplier.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredSuppliers;
    }

    return filteredSuppliers.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [suppliers, searchTerm, sortOrder, stateFilter]);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar proveedores..."
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
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedSuppliers.map((supplier) => {
            const isActive = supplier.state === true || supplier.state === 1;

            return (
              <TableRow key={supplier.supplier_id} className={isActive ? '' : 'bg-gray-100'}>
                <TableCell>{supplier.supplier_id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.address || '—'}</TableCell>
                <TableCell>{supplier.phone || '—'}</TableCell>
                <TableCell>{supplier.email || '—'}</TableCell>
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
                    onClick={() => onEdit(supplier.supplier_id)}
                  >
                    Editar
                  </Button>
                  <Button
                    className={supplier.state ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
                    onClick={() => onDelete(supplier.supplier_id)}
                  >
                    {supplier.state ? "Desactivar" : "Activar"}
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
