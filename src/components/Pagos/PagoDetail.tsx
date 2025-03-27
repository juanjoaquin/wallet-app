import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, Calendar, ClipboardList, AlertCircle } from 'lucide-react';

interface PagoProps {
    id: number;
    monto_pago: number;
    descripcion: string;
    created_at: string;
    estado: string;
}

export const PagoDetail = () => {
    const { pagoId } = useParams();
    const navigate = useNavigate();
    const [pago, setPago] = useState<PagoProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagoEnProgreso, setPagoEnProgreso] = useState(false);
    
    const token = localStorage.getItem('tokenStorage');

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login');
            }, 1000);
            return;
        }

        const getPagoDetalle = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_PAGO_DETALLE}/${pagoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPago(response.data.pago);
            } catch (error) {
                setError('Error al obtener el detalle del pago.');
            } finally {
                setLoading(false);
            }
        };

        getPagoDetalle();
    }, [pagoId, token, navigate]);

    const handlePagar = async () => {
        if (!pago) return;

        setPagoEnProgreso(true);
        
        try {
            await axios.put(`${import.meta.env.VITE_PAGOS}/${pago.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Pago realizado con éxito');
            navigate('/pagos');
        } catch (error) {
            setError('Error al realizar el pago. Inténtalo más tarde.');
        } finally {
            setPagoEnProgreso(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-[50px] shadow-lg max-w-md w-full">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <p className="text-gray-900 text-center font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            {pago && (
                <div className="bg-white p-8 rounded-[50px]  max-w-2xl w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Detalle del Pago</h2>
                        <div className={`px-2 py-2 rounded-full ${
                            pago.estado === 'pendiente' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-[25px]">
                            <ClipboardList className="w-6 h-6 text-indigo-500" />
                            <div>
                                <p className="text-sm text-gray-500">Descripción</p>
                                <p className="text-gray-900 font-medium">{pago.descripcion}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-[25px]">
                            <CreditCard className="w-6 h-6 text-indigo-500" />
                            <div>
                                <p className="text-sm text-gray-500">Monto</p>
                                <p className="text-gray-900 font-medium text-xl">
                                    ${pago.monto_pago.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-[25px]">
                            <Calendar className="w-6 h-6 text-indigo-500" />
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(pago.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {pago.estado === 'pendiente' && (
                        <div className="mt-8">
                            <button
                                onClick={handlePagar}
                                disabled={pagoEnProgreso}
                                className="w-full py-2 bg-indigo-500 text-white rounded-lg font-medium
                                         hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50
                                         disabled:cursor-not-allowed flex items-center justify-center "
                            >
                                {pagoEnProgreso && <Loader2 className="w-5 h-5 animate-spin" />}
                                <span>{pagoEnProgreso ? 'Procesando pago...' : 'Realizar Pago'}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PagoDetail;