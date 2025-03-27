import axios from 'axios';
import { ArrowDownCircleIcon, Info, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

interface UserProps {
    id: number;
    name: string;
    email: string;
}

interface CuentaProps {
    id: number;
    user_id: number;
    saldo: number;
    alias: string;
    created_at: string;
    user: UserProps;
}


interface TransferenciaProps {
    id: number;
    tipo: string;
    cuenta_emisor_id: number;
    cuenta_receptor_id: number;
    monto: number;
    created_at: string;
    cuenta_emisor: { user: { name: string } };
    cuenta_receptor: { user: { name: string } };
}

export const TransferenciaContainer = () => {

    const [userCuenta, setUserCuenta] = useState<CuentaProps | null>(null);
    const [transferencias, setTransferencias] = useState<TransferenciaProps[]>([]);

    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Transferencias"

        if (!token) {
            setTimeout(() => {
                navigate('auth/login')
            }, 1000);
            return;
        }

        const getTransferencias = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_TRANSACCIONES_HISTORIAL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTransferencias(response.data.historial);
            } catch (error) {
                console.log(error)
            }
        }

        const getAccount = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CUENTA_USER, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserCuenta(response.data.cuenta);
            } catch (error) {
                console.log(error);
            }
        }

        getAccount();
        getTransferencias();
    }, []);



    return (
        <div className='p-6 bg-gray-100 min-h-screen'>

            <div>
                <div>
                    <h1 className='text-gray-800 text-2xl mb-4 font-semibold'>Transferir a otra persona </h1>
                    <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>Al clickear en la flecha te llevará a otra sección, donde deberás completar un formulario para transferir dinero.</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="p-10 border rounded-full border-indigo-500 
                  animate-pulse hover:shadow-[0_0_15px_5px_rgba(75,85,99,0.8)]">
                    <Link to='/transferencias/transferir-a-persona'>
                        <Send size={40} className='text-indigo-500' />

                    </Link>
                </div>
            </div>

            <div className='mt-4 flex justify-between items-center text-indigo-600'>
                <h1 className='font-semibold text-xl'>Historial transferencias</h1>

                <ArrowDownCircleIcon />
            </div>
            <div>
                <p className="text-sm mt-4 flex px-1  text-gray-500  gap-1">Lista completa de todos los movimientos que has hecho.</p>
            </div>
            <div className="mt-4">
                {transferencias.length > 0 ? (
                    <>
                        {transferencias.map((trans) => (
                            <div key={trans.id} className="bg-gray-50 px-4 py-2 rounded-lg mt-2 space-y-2">
                                <div className="flex justify-between ">
                                    <div className='space-y-2'>
                                        <p className="font-medium text-gray-800 capitalize">{trans.tipo}</p>
                                        <p className="text-sm text-gray-500">{new Date(trans.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        <span className='font-semibold text-gray-900'>  {trans.tipo === 'recargo' ? '+' : trans.cuenta_emisor_id === userCuenta?.id ? '-' : '+'} ${trans.monto}</span>
                                    </p>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <p className=" text-gray-800 "> {trans.cuenta_emisor.user.name}</p>
                                    <span className='text-sm text-indigo-500'>Para</span>
                                    <p className=" text-gray-800"> {trans.cuenta_receptor.user.name}</p>

                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='bg-gray-50 py-2 px-2 rounded-sm'>

                        <p className=' text-sm text-gray-700'>
                            No contas con transferencias
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
