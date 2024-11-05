'use client'
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
  const router = useRouter();
  const page = new URLSearchParams(window.location.search).get('page');

  return (
    <div className="container mx-auto px-4 py-8">
      {page === 'terminos-condiciones' ? (
        <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <p className="text-gray-700 mb-4">
        Bienvenido a CONSTADENT. Al acceder y utilizar nuestra plataforma, usted acepta cumplir con los siguientes términos y condiciones. Le recomendamos leerlos detenidamente.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Uso de la Plataforma</h2>
      <p className="text-gray-700 mb-4">
        Nuestra plataforma está destinada a profesionales de la odontología y clientes que buscan productos y servicios relacionados. Usted se compromete a utilizarla de manera responsable y conforme a las leyes aplicables.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. Registro de Usuarios</h2>
      <p className="text-gray-700 mb-4">
        Para acceder a ciertas funcionalidades, es necesario registrarse proporcionando información veraz y actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Propiedad Intelectual</h2>
      <p className="text-gray-700 mb-4">
        Todos los contenidos de la plataforma, incluyendo textos, imágenes y logotipos, son propiedad de CONSTADENT o de sus licenciantes y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización previa.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Compras y Pagos</h2>
      <p className="text-gray-700 mb-4">
        Al realizar compras a través de nuestra plataforma, usted acepta proporcionar información de pago precisa y autoriza a CONSTADENT a procesar los cargos correspondientes. Nos reservamos el derecho de rechazar o cancelar pedidos según nuestro criterio.
      </p>
      <h2 className="text-2xl font-semibold mb-4">5. Política de Devoluciones</h2>
      <p className="text-gray-700 mb-4">
        Las devoluciones de productos están sujetas a nuestras políticas específicas. Le recomendamos revisar la sección correspondiente en nuestra plataforma para conocer los detalles y procedimientos aplicables.
      </p>
      <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
      <p className="text-gray-700 mb-4">
        CONSTADENT no se responsabiliza por daños directos o indirectos derivados del uso o imposibilidad de uso de la plataforma, incluyendo pérdidas de datos o beneficios.
      </p>
      <h2 className="text-2xl font-semibold mb-4">7. Modificaciones de los Términos</h2>
      <p className="text-gray-700 mb-4">
        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán efectivas una vez publicadas en la plataforma. Se recomienda revisar esta sección periódicamente.
      </p>
      <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
      <p className="text-gray-700 mb-4">
        Si tiene preguntas o inquietudes sobre estos términos y condiciones, puede comunicarse con nuestro equipo a través de los canales de atención proporcionados en la plataforma CONSTADENT.
      </p>
    </div>
        </>
      ) : page === 'politicas-privacidad' ? (
        <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="text-gray-700 mb-4">
        En CONSTADENT, valoramos y protegemos la privacidad de nuestros usuarios y clientes. A continuación, detallamos cómo gestionamos y utilizamos su información personal dentro de nuestra plataforma.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Recolección de Información Personal</h2>
      <p className="text-gray-700 mb-4">
        Recolectamos la información necesaria para optimizar su experiencia y mejorar nuestros servicios. Esto incluye datos proporcionados directamente por usted, como nombre, dirección, correo electrónico, así como información relacionada con sus preferencias de productos y necesidades odontológicas.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
      <p className="text-gray-700 mb-4">
        La información recopilada se utiliza para gestionar el inventario, brindar soporte personalizado y mejorar la experiencia de usuario en la plataforma de e-commerce y CRM. Nos ayuda a entender sus preferencias y proporcionar ofertas relevantes. También la usamos para coordinar reuniones y brindar soporte técnico continuo a nuestro equipo de odontólogos.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Seguridad de la Información</h2>
      <p className="text-gray-700 mb-4">
        Implementamos medidas de seguridad avanzadas para proteger su información contra accesos no autorizados o alteraciones. Aunque ninguna transmisión digital es completamente segura, nuestro sistema está diseñado para mantener su información bajo los más altos estándares de confidencialidad y protección.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Enlaces a Sitios de Terceros</h2>
      <p className="text-gray-700 mb-4">
        Nuestra plataforma puede contener enlaces a sitios externos para ofrecerle recursos adicionales. No controlamos estos sitios y recomendamos que revise las políticas de privacidad de cada uno de ellos antes de compartir información.
      </p>
      <h2 className="text-2xl font-semibold mb-4">5. Cambios en la Política de Privacidad</h2>
      <p className="text-gray-700 mb-4">
        CONSTADENT se reserva el derecho de actualizar esta política de privacidad para reflejar cambios en nuestros procesos o en las regulaciones aplicables. Los cambios serán publicados en esta página y entrarán en vigor de forma inmediata.
      </p>
      <h2 className="text-2xl font-semibold mb-4">6. Contacto</h2>
      <p className="text-gray-700 mb-4">
        Si tiene preguntas o inquietudes sobre esta política, puede comunicarse con nuestro equipo a través de los canales de atención proporcionados en la plataforma CONSTADENT.
      </p>
    </div>
        </>
      ) : (
        <p className="text-gray-700">Cargando...</p>
      )}
    </div>
  );
}
