// ClientsList.tsx
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
import { Input } from "@/app/shared/components/input";

interface Clients {
  client_id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone: number,
  address: string,
  username: string,
  registration_date: Date,
  state: boolean | number
}

interface ClientTableProps {
  clients: Clients[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedClients = useMemo(() => {
    const filteredClients = clients.filter((client) => {
      const matchesSearchTerm =
        client.client_id.toString().includes(searchTerm) ||
        client.first_name.includes(searchTerm) ||
        client.last_name.includes(searchTerm) ||
        client.email.includes(searchTerm) ||
        client.phone.toString().includes(searchTerm) ||
        client.address.includes(searchTerm) ||
        client.username.includes(searchTerm) ||
        client.registration_date.toString().includes(searchTerm);

      const isActive = client.state === true || client.state === 1;
      const isInactive = client.state === false || client.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredClients;
    }

    return filteredClients.sort((a, b) =>
      sortOrder === 'asc' ? a.client_id - b.client_id : b.client_id - a.client_id
    );
  }, [clients, searchTerm, sortOrder, stateFilter]);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha de Registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedClients.map((client) => {
            const isActive = client.state === true || client.state === 1;

            return (
              <TableRow key={client.client_id} className={isActive ? '' : 'bg-gray-100'}>
                <TableCell>{client.client_id}</TableCell>
                <TableCell>{client.first_name}</TableCell>
                <TableCell>{client.last_name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client.username}</TableCell>
                <TableCell>{new Date(client.registration_date).toLocaleDateString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
