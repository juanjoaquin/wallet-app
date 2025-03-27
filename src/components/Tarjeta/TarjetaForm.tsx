import axios from 'axios';
import { CreditCard, Info, Lock, LockKeyhole } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';


export const TarjetaForm = () => {

    const [error, setError] = useState<string>('');
    const [isOk, setIsOk] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    const tarjetaSchema = z.object({
        numero_tarjeta: z.string().length(16, 'Maximo 16 números'),
        tipo: z.enum(['credito', 'debito'], {
            errorMap: () => ({ message: 'Debe ser "credito" o "debito"' })
        }),
        fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)').refine((date) => new Date(date) > new Date(), { message: 'Debe ser una fecha futura', }),
        CVV: z.string().length(3, 'Deben ser exáctamente 3 digitos').regex(/^\d{3}$/, 'Solo se permiten números'),

    });

    type TarjetaForm = z.infer<typeof tarjetaSchema>;

    const [formData, setFormData] = useState<TarjetaForm>({
        numero_tarjeta: '',
        tipo: "credito",
        fecha_vencimiento: '',
        CVV: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        setIsOk('');
        setIsLoading(true);

        try {
            tarjetaSchema.parse(formData);

            await axios.post(import.meta.env.VITE_ASOCIAR_TARJETA, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsOk('La tarjeta fue asociada correctamente');


            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            setError('Error al asociar la tarjeta');
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-50 rounded-lg  p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Información de Tarjeta</h2>
                <p className="text-sm  mb-6 text-gray-500 flex gap-1"><Info size={22} />En caso que deseas recargar tu Wallet, necesitas asociar la tarjeta para deposirtarte dinero.</p>


                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label htmlFor="numero_tarjeta" className="block text-sm font-medium text-indigo-600">
                            Número de tarjeta
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-indigo-600" />
                            </div>
                            <input
                                type="text"
                                id="numero_tarjeta"
                                name="numero_tarjeta"
                                value={formData.numero_tarjeta}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                                maxLength={16}
                                placeholder="1234567812345678"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-indigo-600 mb-1">
                            Tipo de Tarjeta
                        </label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full p-2 border border-indigo-600 rounded-sm bg-white focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                        >
                            <option value="credito">Crédito</option>
                            <option value="debito">Débito</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-indigo-600 mb-1">
                            Fecha de Vencimiento
                        </label>
                        <input
                            type="date"
                            name="fecha_vencimiento"
                            value={formData.fecha_vencimiento}
                            onChange={handleChange}
                            className="w-full p-2 border border-indigo-600 rounded-sm focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                        />
                    </div>


                    <div>
                        <label htmlFor="CVV" className="block text-sm font-medium text-indigo-600">
                            CVV
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockKeyhole className="h-5 w-5 text-indigo-600" />
                            </div>
                            <input
                                type="text"
                                id="CVV"
                                name="CVV"
                                value={formData.CVV}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                                maxLength={3}
                                placeholder="123"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    {isOk && (
                        <div className="text-green-600 text-sm">{isOk}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
                    >
                        {isLoading ? 'Procesando...' : 'Guardar Tarjeta'}
                    </button>
                </form>
            </div>
        </div>
    );
}
