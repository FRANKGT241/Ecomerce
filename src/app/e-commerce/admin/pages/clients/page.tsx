// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ClientTable } from "./components/ClientsList";
import { toast } from "./components/ui/use-toast";

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

export default function Clients() {
  const [clients, setClients] = useState<Clients[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener los clientes");

      const data: Clients[] = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los clientes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <ClientTable clients={clients} />
    </div>
  );
}
