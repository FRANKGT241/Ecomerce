'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from "@/app/shared/components/button";
import { Menu, User, Settings, Bell } from "lucide-react";
import { motion } from 'framer-motion';
import SideMenu from './shared-admin/ui/sideBar';
import { isAuthenticated } from '@/app/shared/utils/auth';

export default function ECommerceLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      router.push('/e-commerce/auth/signin-admi');
    } else {
      setAuthChecked(true);
    }

    const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
    if (!hasSeenAnimation) {
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem('hasSeenAnimation', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hasSeenAnimation');
    if (!isAuthenticated()) {
      router.push('/e-commerce/auth/signin-admi');
    }
  };

  if (!authChecked) {
    // No renderizar nada hasta que la autenticación sea verificada
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <motion.div
          className="text-2xl font-bold"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold text-blue-500">COSTADENT</h1>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-gray-600" />
          <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </header>
      
      <main className="flex-grow overflow-auto">{children}</main>

      {/* Sidebar */}
      <SideMenu isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <footer className="fixed bottom-0 left-0 right-0 flex justify-around items-center p-4 bg-white border-t">
        <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
        <Button variant="ghost"><User className="w-6 h-6" /></Button>
        <Button variant="ghost"><Settings className="w-6 h-6" /></Button>
      </footer>
    </div>
  );
}
