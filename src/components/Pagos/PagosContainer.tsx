import axios from 'axios';
import { ArrowDownCircleIcon, ArrowDownSquareIcon, Info, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

interface PagoProps {
    id: number;
    monto_pago: number;
    descripcion: string;
    created_at: string;
    estado: string;
}

export const PagosContainer = () => {

    const [pagos, setPagos] = useState<PagoProps[]>([]);
    const [aprobados, setAprobados] = useState<PagoProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    useEffect(() => {

        document.title = "Pagos"

        if (!token) {
            setTimeout(() => {
                navigate('/auth/login');
            }, 1000);
            return;
        }

        const getPagosPendientes = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_PAGOS_PENDIENTES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTimeout(() => {
                    setPagos(response.data.pagos);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                setError("Error al obtener los pagos pendientes. Inténtalo más tarde.");

            } finally {
                setLoading(false);
            }
        };

        const getPagosAprobados = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_PAGOS_APROBADOS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTimeout(() => {
                    setAprobados(response.data.pagos);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                setError("Error al obtener los pagos aprobados. Inténtalo más tarde.");

            } finally {
                setLoading(false);
            }
        };

        getPagosPendientes();
        getPagosAprobados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>

            <div>
                <h1 className='text-gray-800 text-2xl mb-4  font-semibold'>Pagos </h1>
               
                    <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Acá veras la lista de todos los pagos que tienes pendientes, y aprobados. Además de que si contas con los fondos suficientes, podrás pagar lo que deaseas.</span>
                      </p>
                    </div>
            </div>


            <div className='mt-4'>
                <h3 className='text-indigo-500 text-lg  font-medium flex items-center justify-between'>Pagos pendientes <ArrowDownCircleIcon /></h3>
            </div>

            <div className='mt-4 '>
                {pagos.length > 0 ? (
                    <>
                        {pagos.map((pago) => (
                            <div key={pago.id} className='flex flex-col bg-gray-50 px-2 py-2 rounded-lg mt-2'>
                                <Link to={`/pagos/${pago.id}`}>

                                
                                
                                <div className='flex justify-between items-center '>
                                    <div className='flex flex-col space-y-4'>
                                        <p className='font-medium capitalize text-gray-800'> {pago.descripcion}</p>
                                        <p className='text-sm text-gray-500'>{new Date(pago.created_at).toLocaleDateString()}</p>

                                    </div>
                                    <div className='space-y-4'>
                                        <p className='font-medium capitalize text-red-700 text-end'> ${pago.monto_pago}</p>
                                        <p className={`font-semibold capitalize  text-gray-800 ${pago.estado === 'pendiente' ? 'text-yellow-600' : ''}`}> {pago.estado}</p>

                                    </div>



                                </div>
                                </Link>

                            </div>
                        ))}
                    </>
                ) : (
                    <div className='bg-gray-50 py-2 px-2 rounded-sm'>

                        <p className=' text-sm text-gray-700'>
                            No cuentas con pagos pendientes
                        </p>
                    </div>
                )}

            </div>

            <div className='mt-4'>
                <h3 className='text-indigo-500 text-lg  font-medium flex items-center justify-between'>Pagos aprobados <ArrowDownSquareIcon /></h3>
            </div>

            <div className='mt-4 '>
                {aprobados.length > 0 ? (
                    <>
                        {aprobados.map((aprobado) => (
                            <div key={aprobado.id} className='flex flex-col bg-gray-50 px-2 py-2 rounded-lg mt-2'>
                                <div className='flex justify-between items-center '>
                                    <div className='flex flex-col space-y-4'>
                                        <p className='font-normal capitalize text-gray-800'> {aprobado.descripcion}</p>
                                        <p className='text-sm text-gray-500'>{new Date(aprobado.created_at).toLocaleDateString()}</p>

                                    </div>
                                    <div className='space-y-4'>
                                        <p className='font-medium capitalize text-gray-700 text-end'> ${aprobado.monto_pago}</p>
                                        <p className={`font-semibold capitalize  text-gray-800 ${aprobado.estado === 'completada' ? 'text-green-600' : ''}`}> {aprobado.estado === "completada" ? 'Aprobado' : ''}</p>

                                    </div>



                                </div>


                            </div>
                        ))}
                    </>
                ) : (
                    <div className='bg-gray-50 py-2 px-2 rounded-sm'>

                        <p className=' text-sm text-gray-700'>
                            No tenes pagos aprobados
                        </p>
                    </div>
                )}

            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}


        </div>
    )
}
