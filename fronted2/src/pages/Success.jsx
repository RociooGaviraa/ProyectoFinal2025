import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-light">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pago realizado con éxito!</h1>
      <p className="text-lg text-dark mb-6">Gracias por tu compra. Te esperamos en el evento.</p>
      <Link to="/events" className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-secondary transition">Ver más eventos</Link>
    </div>
  </div>
);

export default Success; 