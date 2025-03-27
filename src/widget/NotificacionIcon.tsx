import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificaciones } from '../hooks/useNotificaciones';

const NotificacionIcon = () => {
  const { notificaciones, marcarComoLeidas } = useNotificaciones();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleShow = () => {
    setShowDropdown(!showDropdown);

    if (!showDropdown) {
      marcarComoLeidas();
    }
  };

  const tieneNotificacionesNoLeidas = notificaciones.some((noti) => !noti.leida);

  return (
    <div className="relative">
      <button onClick={toggleShow} className="relative p-1">
        <Bell size={22} className="text-gray-800" />
        {tieneNotificacionesNoLeidas && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs h-5 w-5 rounded-full">
            {notificaciones.filter((noti) => !noti.leida).length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-100 text-white shadow-lg rounded-md p-2 border border-indigo-700 z-50">
          <p className="text-center text-sm font-light text-indigo-700">Notificaciones</p>

          {notificaciones.length > 0 ? (
            notificaciones
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((noti) => (
              <div key={noti.id} className="p-2 border-b border-indigo-700">
                <Link to="/notificaciones">
                  <p className="text-sm font-medium text-gray-900">{noti.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(noti.created_at).toLocaleString()}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No tienes notificaciones.</p>
          )}
          <Link to="/notificaciones" className="block text-center text-indigo-700 mt-2">
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificacionIcon;