// src/components/Footer.jsx
import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <div className="footer flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Aquí va el contenido principal de la página */}
      </div>
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <p className='text-center'>© 2024 Task Manager. Todos los derechos reservados.</p>
        <p className='text-center'>
          Hecho con ❤️ por <a href="https://github.com/camilo0999/task-manager.git">Juan Camilo Ibarguen Grueso</a>
        </p>
      </footer>
    </div>
  );
};


export default Footer;
