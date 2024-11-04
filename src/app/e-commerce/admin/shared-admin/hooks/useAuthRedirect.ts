// hooks/useAuthRedirect.ts
'use client'; // Esto es necesario para asegurar que useRouter funcione en Next.js

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/app/shared/utils/auth';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/e-commerce/auth/signin-admi');
    }
  }, [router]);
};
