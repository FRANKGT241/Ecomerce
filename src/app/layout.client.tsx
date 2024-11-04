'use client';

import Header from '@/app/layout-main-ecomerce/header/header';
import Footer from '@/app/layout-main-ecomerce/footer/footer';
import { usePathname } from 'next/navigation';
import {SessionProvider} from 'next-auth/react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/e-commerce');

  if (isAdminRoute) {
    return <>{children}</>;
  }


  return (
    <div className="flex flex-col min-h-screen">
        <SessionProvider>      
          <Header />
            <main className="flex-grow overflow-auto">{children}</main>
          <Footer />
      </SessionProvider>
    </div>
  );
}
