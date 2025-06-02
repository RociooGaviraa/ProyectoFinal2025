import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-light">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pago cancelado</h1>
      <p className="text-lg text-dark mb-6">El pago fue cancelado o no se completó. Puedes intentarlo de nuevo si lo deseas.</p>
      <Link to="/events" className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-secondary transition">Volver a eventos</Link>
    </div>
  </div>
);

export default Cancel; 