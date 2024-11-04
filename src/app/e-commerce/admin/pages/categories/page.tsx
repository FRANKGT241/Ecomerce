"use client";

import React, { useState, useEffect } from "react";
import { CategoryForm } from "./components/CategoryForm"; // Cambié el formulario a categorías
import { CategoryTable } from "./components/CategoryList"; // Cambié la tabla a categorías
import { Button } from "@/app/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

interface Category {
  category_id: number;
  name: string;
  description: string;
  state: boolean | number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener las categorías");

      const data: Category[] = await response.json();
      setCategories(data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener las categorías",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: Omit<Category, "category_id" | "state">) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al crear la categoría");

      await fetchCategories();
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Categoría creada exitosamente",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: Omit<Category, "category_id" | "state">) => {
    try {
      if (!editingCategory) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory.category_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar la categoría");

      await fetchCategories();
      setIsDialogOpen(false);
      setEditingCategory(null);

      toast({
        title: "Éxito",
        description: "Categoría actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
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
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state: false }),
        }
      );

      if (!response.ok) throw new Error("Error al eliminar la categoría");

      await fetchCategories();

      toast({
        title: "Éxito",
        description: "Categoría eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: number) => {
    const categoryToEdit = categories.find((category) => category.category_id === id);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingCategory(null);
              setIsDialogOpen(true);
            }}
          >
            Crear Nueva Categoría
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            initialData={editingCategory}
          />
        </DialogContent>
      </Dialog>
      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
