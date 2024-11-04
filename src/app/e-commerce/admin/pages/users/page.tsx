"use client";

import React, { useState, useEffect } from "react";
import { UserForm } from "./components/UserForm";
import { UserTable } from "./components/UserList";
import { Button } from "@/app/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

// Interface for the user
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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los usuarios");

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los usuarios",
        variant: "destructive",
      });
    }
  };

  // Fetch roles from the API
  const fetchRoles = async () => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los roles");

      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los roles",
        variant: "destructive",
      });
    }
  };

  // Create a new user
  const handleCreate = async (data: Omit<User, "user_id" | "state">) => {
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
  
      // Revisar que la URL incluya correctamente /api
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Error al crear el usuario");
  
      await fetchUsers();
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Usuario creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };  

  // Update an existing user
  const handleUpdate = async (data: Omit<User, "user_id" | "state">) => {
    try {
      if (!editingUser) return;

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "No se encontró un token. Por favor, inicia sesión.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el usuario");

      await fetchUsers();
      setIsDialogOpen(false);
      setEditingUser(null);

      toast({
        title: "Éxito",
        description: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  // Change user status (activate/deactivate)
  const handleStatusChange = async (id: number) => {
    console.log("User ID:", id); // Log para verificar el ID del usuario
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cambiar el estado del usuario");

      await fetchUsers();

      toast({
        title: "Éxito",
        description: "Estado del usuario cambiado exitosamente",
      });
    } catch (error) {
      console.error("Error changing user status:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del usuario",
        variant: "destructive",
      });
    }
  };

  // Edit an existing user
  const handleEdit = (id: number) => {
    const userToEdit = users.find((user) => user.user_id === id);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingUser(null);
              setIsDialogOpen(true);
            }}
          >
            Crear Nuevo Usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={editingUser ? handleUpdate : handleCreate}
            initialData={editingUser}
            roles={roles}
          />
        </DialogContent>
      </Dialog>
      <UserTable
        users={users}
        roles={roles}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
