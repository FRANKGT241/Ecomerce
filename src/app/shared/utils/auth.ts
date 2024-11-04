import { jwtDecode } from 'jwt-decode';  // Note the change here

interface DecodedToken {
  exp: number;
  username?: string;
  role?: string;
}

export const isAuthenticated = (): boolean => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return false;
  }

  try {
    // Decodificar el token y usar la interfaz DecodedToken para el tipado
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // Verificar si el token contiene el campo exp y si no ha expirado
    return decodedToken.exp > currentTime;
  } catch (error) {
    // Si ocurre algún error en la decodificación, retornar false
    console.error('Error decoding token:', error);
    return false;
  }
};