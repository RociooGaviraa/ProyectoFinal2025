import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#14b8a6', '#f472b6', '#facc15', '#6366f1', '#f87171'];

const Statistics = () => {
  const [topEvents, setTopEvents] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [topAttendee, setTopAttendee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        };
        const [eventsRes, creatorsRes, attendeeRes] = await Promise.all([
          fetch('/api/stats/top-events', { headers }),
          fetch('/api/stats/top-creators', { headers }),
          fetch('/api/stats/top-attendees', { headers }),
        ]);
        if (!eventsRes.ok || !creatorsRes.ok || !attendeeRes.ok) throw new Error('Error al cargar estadísticas');
        setTopEvents(await eventsRes.json());
        setTopCreators(await creatorsRes.json());
        setTopAttendee(await attendeeRes.json());
      } catch (err) {
        setError(err.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando estadísticas...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-2 md:px-8">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-teal-700 drop-shadow-lg tracking-tight">Estadísticas de la plataforma</h1>

      {/* Eventos con más inscripciones */}
      <section className="mb-14">
        <div className="bg-gradient-to-br from-teal-50 via-white to-teal-100 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-teal-700 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-teal-400 rounded-full animate-pulse"></span>
            Eventos con más inscripciones
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topEvents.slice(0, 5)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" tick={{ fontSize: 13, fontWeight: 500 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, background: '#f0fdfa' }} />
              <Bar dataKey="attendees" fill="#14b8a6" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Usuarios que más eventos crean */}
      <section className="mb-14">
        <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-pink-600 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-pink-400 rounded-full animate-pulse"></span>
            Usuarios que más eventos crean
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topCreators.slice(0, 5)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={user => `${user.name} ${user.surname}`} tick={{ fontSize: 13, fontWeight: 500 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, background: '#fdf2f8' }} formatter={(value, name) => [value, name === 'created_events' ? 'Eventos creados' : name]} />
              <Bar dataKey="created_events" fill="#f472b6" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Usuario que más eventos se inscribe (abajo) */}
      <section>
        <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-yellow-600 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
            Usuario que más eventos se inscribe
          </h2>
          {topAttendee ? (
            <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
              <PieChart width={220} height={220}>
                <Pie
                  data={[{ name: `${topAttendee.name} ${topAttendee.surname}`, value: topAttendee.attended_events }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#facc15"
                  dataKey="value"
                  label
                >
                  <Cell key="cell-0" fill="#facc15" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, background: '#fefce8' }} />
                <Legend />
              </PieChart>
              <div className="flex flex-col items-center md:items-start">
                <div className="text-xl font-bold text-yellow-800 mb-2 mt-2">{topAttendee.name} {topAttendee.surname}</div>
                <div className="text-gray-700 mb-1">{topAttendee.email}</div>
                <div className="text-yellow-700 font-semibold">Inscrito en {topAttendee.attended_events} eventos</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No hay datos de inscripciones.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Statistics; 