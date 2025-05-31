import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAllUsers().then(setUsers).finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div>
            <h1>Panel de Administración</h1>
            <h2>Usuarios registrados</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} ({user.email}) - {user.roles.join(', ')}
                        <Link to={`/admin/usuarios/${user.id}/eventos`} style={{ marginLeft: 10 }}>
                            Ver eventos
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
