"use client";

import React, { useState, useEffect } from "react";
import { SupplierForm } from "./components/SupplierForm";
import { SupplierTable } from "./components/SupplierList";
import { Button } from "@/app/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

interface Supplier {
  supplier_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  state: boolean | number;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/suppliers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener los proveedores");

      const data: Supplier[] = await response.json();
      setSuppliers(data); 
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los proveedores",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: Omit<Supplier, "supplier_id" | "state">) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/suppliers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al crear el proveedor");

      await fetchSuppliers();
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Proveedor creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el proveedor",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: Omit<Supplier, "supplier_id" | "state">) => {
    try {
      if (!editingSupplier) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${editingSupplier.supplier_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el proveedor");

      await fetchSuppliers();
      setIsDialogOpen(false);
      setEditingSupplier(null);

      toast({
        title: "Éxito",
        description: "Proveedor actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el proveedor",
        variant: "destructive",
      });
    }
  };

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
        `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state: false }),
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el proveedor");

      await fetchSuppliers();

      toast({
        title: "Éxito",
        description: "Proveedor eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: number) => {
    const supplierToEdit = suppliers.find((supplier) => supplier.supplier_id === id);
    if (supplierToEdit) {
      setEditingSupplier(supplierToEdit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingSupplier(null);
              setIsDialogOpen(true);
            }}
          >
            Crear Nuevo Proveedor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? "Editar Proveedor" : "Crear Nuevo Proveedor"}
            </DialogTitle>
          </DialogHeader>
          <SupplierForm
            onSubmit={editingSupplier ? handleUpdate : handleCreate}
            initialData={editingSupplier}
          />
        </DialogContent>
      </Dialog>
      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
