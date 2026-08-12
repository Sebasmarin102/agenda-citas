import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Cargando...</p>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>      

      <section className="stat-card">
        <h3>Horarios más pedidos</h3>
        <ul>
          {stats.busiestHours.map((h) => (
            <li key={h.start_time}>{h.start_time}: {h.count} cita(s)</li>
          ))}
        </ul>
      </section>

      <section className="stat-card">
        <h3>Días con más demanda</h3>
        <ul>
          {stats.busiestDays.map((d) => (
            <li key={d.day}>{d.day}: {d.count} cita(s)</li>
          ))}
        </ul>
      </section>

      <section className="stat-card">
        <h3>Clientas frecuentes</h3>
        <ul>
          {stats.frequentClients.map((c) => (
            <li key={c.phone}>{c.client_name} ({c.phone}): {c.visit_count} visita(s)</li>
          ))}
        </ul>
      </section>

      <section className="stat-card">
        <h3>Tasa de no-shows</h3>
        <p className="big-number">{stats.noShowRate}%</p>
      </section>
    </div>
  );
}

export default Dashboard;