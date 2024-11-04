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

interface Batch {
  batch_id: number;
  quantity: number;
  expiration_date: string;
  notification_date: string;
  manufacturing_date: string;
  state: boolean | number;
  code_batch : string;// Maneja tanto booleanos como números
}

interface BatchTableProps {
  batches: Batch[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function BatchTable({ batches, onEdit, onDelete }: BatchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedBatches = useMemo(() => {
    const filteredBatches = batches.filter((batch) => {
      const matchesSearchTerm =
        batch.batch_id.toString().includes(searchTerm) ||
        batch.quantity.toString().includes(searchTerm) ||
        batch.expiration_date.includes(searchTerm) ||
        batch.notification_date?.includes(searchTerm) ||
        batch.code_batch.toString().includes(searchTerm) ||
        batch.manufacturing_date.includes(searchTerm);

      const isActive = batch.state === true || batch.state === 1;
      const isInactive = batch.state === false || batch.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredBatches;
    }

    return filteredBatches.sort((a, b) =>
      sortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity
    );
  }, [batches, searchTerm, sortOrder, stateFilter]);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar lotes..."
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
          <option value="asc">Cantidad Ascendente</option>
          <option value="desc">Cantidad Descendente</option>
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
            <TableHead>No.</TableHead>
            <TableHead>Codigo de lote</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Fecha de Expiración</TableHead>
            <TableHead>Fecha de Notificación</TableHead>
            <TableHead>Fecha de Fabricación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedBatches.map((batch) => {
            const isActive = batch.state === true || batch.state === 1;

            return (
              <TableRow key={batch.batch_id} className={isActive ? '' : 'bg-gray-100'}>
                <TableCell>{batch.batch_id}</TableCell>
                <TableCell>{batch.code_batch}</TableCell>
                <TableCell>{batch.quantity}</TableCell>
                <TableCell>{new Date(batch.expiration_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {batch.notification_date
                    ? new Date(batch.notification_date).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>{new Date(batch.manufacturing_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => onEdit(batch.batch_id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(batch.batch_id)}
                  >
                    Eliminar
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
