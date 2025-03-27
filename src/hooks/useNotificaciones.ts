import axios from 'axios';
import { useEffect, useState } from 'react';

interface NotiProps {
  id: number;
  tipo: string;
  created_at: string;
  mensaje: string;
  leida: boolean;
}

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<NotiProps[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('tokenStorage');
    if (!token) return;

    const getNoti = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_NOTIFICACIONES, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotificaciones(response.data.notificaciones);
      } catch (error) {
        console.log(error);
      }
    };

    getNoti();
  }, []);

  const marcarComoLeidas = async () => {
    try {
      const token = localStorage.getItem('tokenStorage');
      if (!token) return;

      await axios.patch(`${import.meta.env.VITE_API_URL}/notificaciones/marcar-todas-leidas`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((noti) => ({ ...noti, leida: true }))
      );
    } catch (error) {
      console.error('Error al marcar las notificaciones como leídas', error);
    }
  };

  return { notificaciones, marcarComoLeidas };
};