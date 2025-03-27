import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface NotiProps {
    id: number;
    tipo: string;
    created_at: string;
    mensaje: string;
}

export const Notificaciones = () => {

    const [notificaciones, setNotificaciones] = useState<NotiProps[]>([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('tokenStorage');

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000);
        }
        const getNoti = async () => {
            try {
                const reponse = await axios.get(import.meta.env.VITE_NOTIFICACIONES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotificaciones(reponse.data.notificaciones);
            } catch (error) {
                console.log(error)
            }
        }
        getNoti();
    }, [])

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <div>
                <h1 className='text-gray-800 text-2xl mb-4 font-semibold'>Notificaciones </h1>
                <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Acá verás todas las notificaciones que has recibido.</span>
                    </p>
                </div>
            </div>
            <div className='mt-4'>

                {notificaciones.length > 0 ? (
                    notificaciones.map((noti) => (
                        <div key={noti.id} className=" p-2 mb-2 rounded-lg bg-gray-50 shadow-sm">
                            <div className='flex items-center gap-2'>
                                <Info size={20} className='text-indigo-500 font-semibold' />

                                <span className='text-indigo-600  font-semibold '>
                                    {noti.tipo === 'pago' ? 'Pago' : noti.tipo === 'transferencia' ? 'Transferencia' : noti.tipo === 'recargo' ? 'Recargo saldo' : ''}

                                </span>

                            </div>

                            <div className='mt-2 px-2'>
                                <p className='text-gray-800'>{noti.mensaje}</p>

                            </div>

                            <div className='mt-2 px-2'>
                                <span className='text-sm text-indigo-400'> {new Date(noti.created_at).toLocaleString()}</span>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No tienes notificaciones.</p>
                )}
            </div>
        </div>
    )
}
