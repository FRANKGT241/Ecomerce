"use client";

import React, { useState, useEffect } from "react";
import { RoleForm } from "./components/RoleForm"; // Formulario para roles
import { RoleTable } from "./components/RoleList"; // Tabla de roles
import { Button } from "@/app/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

// Interfaz para el rol
interface Role {
  role_id: number;
  name: string;
  description: string;
  state: boolean | number;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Obtener los roles desde la API
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener los roles");

      const data: Role[] = await response.json();
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

  // Crear un nuevo rol
  const handleCreate = async (data: Omit<Role, "role_id" | "state">) => {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al crear el rol");

      await fetchRoles();
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Rol creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      });
    }
  };

  // Actualizar un rol existente
  const handleUpdate = async (data: Omit<Role, "role_id" | "state">) => {
    try {
      if (!editingRole) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/roles/${editingRole.role_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el rol");

      await fetchRoles();
      setIsDialogOpen(false);
      setEditingRole(null);

      toast({
        title: "Éxito",
        description: "Rol actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol",
        variant: "destructive",
      });
    }
  };

  // Cambiar el estado del rol a inactivo (desactivar)
  const handleDelete = async (id: number) => {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state: false }),
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el rol");

      await fetchRoles();

      toast({
        title: "Éxito",
        description: "Rol eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol",
        variant: "destructive",
      });
    }
  };

  // Editar un rol existente
  const handleEdit = (id: number) => {
    const roleToEdit = roles.find((role) => role.role_id === id);
    if (roleToEdit) {
      setEditingRole(roleToEdit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Roles</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingRole(null);
              setIsDialogOpen(true);
            }}
          >
            Crear Nuevo Rol
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
            </DialogTitle>
          </DialogHeader>
          <RoleForm
            onSubmit={editingRole ? handleUpdate : handleCreate}
            initialData={editingRole}
          />
        </DialogContent>
      </Dialog>
      <RoleTable
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
