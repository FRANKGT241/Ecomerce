"use client";

import React, { useState, useEffect } from "react";
import { BatchForm } from "./components/BatchForm";
import { BatchTable } from "./components/BatchList";
import { Button } from "@/app/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

interface Batch {
  batch_id: number;
  quantity: number;
  expiration_date: string;
  notification_date: string;
  manufacturing_date: string;
  state: boolean | number; 
  code_batch: string; 
}

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/batches`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener los lotes");

      const data: Batch[] = await response.json();
      setBatches(data); // Almacenamos todos los lotes sin filtrar
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los lotes",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: Omit<Batch, "batch_id" | "state">) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/batches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al crear el lote");

      await fetchBatches();
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Lote creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating batch:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el lote",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: Omit<Batch, "batch_id" | "state">) => {
    try {
      if (!editingBatch) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/batches/${editingBatch.batch_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el lote");

      await fetchBatches();
      setIsDialogOpen(false);
      setEditingBatch(null);

      toast({
        title: "Éxito",
        description: "Lote actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error updating batch:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el lote",
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
        `${process.env.NEXT_PUBLIC_API_URL}/batches/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state: false }),
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el lote");

      await fetchBatches();

      toast({
        title: "Éxito",
        description: "Lote eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el lote",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: number) => {
    const batchToEdit = batches.find((batch) => batch.batch_id === id);
    if (batchToEdit) {
      const adjustDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
      };

      setEditingBatch({
        ...batchToEdit,
        expiration_date: adjustDate(batchToEdit.expiration_date),
        notification_date: batchToEdit.notification_date ? adjustDate(batchToEdit.notification_date) : '',
        manufacturing_date: adjustDate(batchToEdit.manufacturing_date),
      });
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lotes</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingBatch(null);
              setIsDialogOpen(true);
            }}
          >
            Crear Nuevo Lote
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBatch ? "Editar Lote" : "Crear Nuevo Lote"}
            </DialogTitle>
          </DialogHeader>
          <BatchForm
            onSubmit={editingBatch ? handleUpdate : handleCreate}
            initialData={editingBatch}
          />
        </DialogContent>
      </Dialog>
      <BatchTable
        batches={batches}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
