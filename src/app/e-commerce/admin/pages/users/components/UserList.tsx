"use client";

import React, { useState, useMemo } from "react";
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

interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  state: boolean | number;
}

interface Role {
  role_id: number;
  name: string;
}

interface UserTableProps {
  users: User[];
  roles: Role[];
  onEdit: (id: number) => void;
  onStatusChange: (id: number) => void;
}

export function UserTable({ users, roles, onEdit, onStatusChange }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedUsers = useMemo(() => {
    const filteredUsers = users.filter((user) => {
      const matchesSearchTerm =
        user.user_id.toString().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

      const isActive = user.state === true || user.state === 1;
      const isInactive = user.state === false || user.state === 0;

      const matchesStateFilter =
        stateFilter === 'all' ||
        (stateFilter === 'active' && isActive) ||
        (stateFilter === 'inactive' && isInactive);

      return matchesSearchTerm && matchesStateFilter;
    });

    if (sortOrder === 'none') {
      return filteredUsers;
    }

    return filteredUsers.sort((a, b) =>
      sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
    );
  }, [users, searchTerm, sortOrder, stateFilter]);

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.role_id === roleId);
    return role ? role.name : 'N/A';
  };

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar usuarios..."
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
          <option value="asc">Nombre de usuario Ascendente</option>
          <option value="desc">Nombre de usuario Descendente</option>
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
            <TableHead>Nombre de usuario</TableHead>
            <TableHead>Nombre completo</TableHead>
            <TableHead>Correo electrónico</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => {
            const isActive = user.state === true || user.state === 1;

            return (
              <TableRow key={user.user_id} className={isActive ? '' : 'bg-gray-100'}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleName(user.role_id)}</TableCell>
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
                    onClick={() => onEdit(user.user_id)}
                  >
                    Editar
                  </Button>
                  <Button
                    className={`${isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                    onClick={() => onStatusChange(user.user_id)}
                  >
                    {isActive ? "Desactivar" : "Activar"}
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