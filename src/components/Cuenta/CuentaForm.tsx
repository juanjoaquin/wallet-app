import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const cuentaSchema = z.object({
    alias: z.string()
        .min(3, 'El alias debe tener al menos 3 caracteres')
        .max(50, 'El alias no puede superar los 50 caracteres')
});

type CuentaFormData = z.infer<typeof cuentaSchema>;

export const CuentaForm = () => {
    const [formData, setFormData] = useState<CuentaFormData>({
        alias: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [isOk, setIsOk] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsOk(null);
        setIsLoading(true);

        try {
            cuentaSchema.parse(formData);

            await axios.post(import.meta.env.VITE_CREAR_CUENTA, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsOk('Cuenta creada exitosamente');
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0]?.message || 'Error en el formulario');
            } else {
                setError('Error al crear la cuenta');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-lg p-8 ">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">
                    Crear cuenta en Wallet
                </h2>

                <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Únicamente deberas elegir un alias, este se asociará a tu cuenta y se creará automáticamente</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-indigo-600">
                            Alias de la cuenta
                        </label>
                        <input
                            type="text"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            className="block w-full p-2 border border-indigo-600 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-white focus:outline-none"
                            placeholder="Ejemplo: sanmartin.heroe.arg"
                        />
                    </div>

                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {isOk && <div className="text-green-600 text-sm">{isOk}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>
            </div>
        </div>
    );
};
