import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { DollarSign, Info } from 'lucide-react';

export const TarjetaRecargoForm = () => {
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [saldo, setSaldo] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    const recargoSchema = z.object({
        monto: z.number()
            .min(1, 'El monto mínimo es $1')
            .max(1000000, 'El monto máximo es $1,000,000')
    });

    type RecargoForm = z.infer<typeof recargoSchema>;

    const [formData, setFormData] = useState<RecargoForm>({
        monto: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            recargoSchema.parse(formData);

            const response = await axios.post(
                import.meta.env.VITE_RECARGAR_SALDO,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage('Saldo recargado exitosamente');
            setSaldo(response.data.saldo_actual);

            setTimeout(() => {
                navigate('/home');
            }, 2000);

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setError(error.errors[0].message);
            } else {
                setError(error.response?.data?.message || 'Error al recargar saldo');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-50 rounded-2xl  p-8">
                <div className="flex items-center justify-center mb-8">

                </div>

                <h2 className="text-3xl font-bold mb-2 text-gray-800">
                    Recargar Saldo
                </h2>

                <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Ingresa el monto que deseas recargar. Tienes un tope de dinero que puedes cargar.</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 pb-5 flex items-center justify-center pointer-events-none">
                            <DollarSign className="h-6 w-6 text-indigo-500" />
                        </div>
                        <input
                            type="number"
                            value={formData.monto}
                            onChange={(e) => setFormData({ monto: Number(e.target.value) })}
                            className="block w-full  py-4 text-2xl font-bold text-center border-2 border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-white"
                            placeholder="0"
                            min="1"
                            step="1"
                        />
                        <p className=" text-sm text-gray-500 mt-2">
                            Monto mínimo $1
                        </p>
                    </div>



                    {saldo > 0 && (
                        <div className="bg-indigo-50 p-4 rounded-xl">
                            <p className="text-center text-indigo-700 font-medium">
                                Saldo Actual: ${saldo.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                            <p className="text-green-700 font-medium">{successMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-500 text-white py-3 px-2 rounded-xl text-lg font-semibold hover:bg-indigo-600 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span>Recargar Ahora</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TarjetaRecargoForm;