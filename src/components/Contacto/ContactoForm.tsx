import axios from 'axios';
import { Info, User } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface Contacto {
    id: number;
    name: string;
}

export const ContactoForm = () => {

    const [error, setError] = useState<string>('');
    const [isOk, setIsOk] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate();
    const token = localStorage.getItem('tokenStorage');

    const contactoSchema = z.object({
        contacto_id: z.number()
    });

    type ContactoForm = z.infer<typeof contactoSchema>;

    const [formData, setFormData] = useState<ContactoForm>({
        contacto_id: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'contacto_id' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsOk('');
        setIsLoading(true);

        try {
            contactoSchema.parse(formData);

            await axios.post(
                import.meta.env.VITE_AGREGAR_CONTACTO,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsOk('Contacto agregado correctamente');

            setTimeout(() => {
                navigate('/home');
            }, 2000);

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setError(error.errors[0].message);
            } else {
                setError(error.response?.data?.message || 'Error al agregar contacto');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className='p-6 bg-gray-100 min-h-screen'>

            <div>
                <h1 className='text-gray-800 text-2xl mb-4 font-semibold'>Agregar contactos </h1>
                <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Debes buscar por el ID del usuario, y esté formará parte de tu lista de contactos.</span>
                    </p>
                </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 ml-4 flex items-center justify-center pointer-events-none">
                        <User className="h-6 w-6 text-indigo-500" />
                    </div>
                    <input
                        type="number"
                        name="contacto_id"
                        value={formData.contacto_id}
                        onChange={handleChange}
                        className="block w-full py-4 text-2xl font-bold text-center border-2 border-indigo-500 rounded-xl focus:ring-2  focus:outline-none"
                        placeholder="0"
                    />

                </div>


                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {isOk && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                        <p className="text-green-700 font-medium">{isOk}</p>
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
                            <span>Agregar contacto</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
