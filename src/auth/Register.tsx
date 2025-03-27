import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Register = () => {
    const registerSchema = z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1)
    });

    type RegisterForm = z.infer<typeof registerSchema>

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterForm>({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<string>('');
    const [isOk, setIsOk] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');
        setIsOk('');
        setIsLoading(true);

        try {
            registerSchema.parse(formData);
            await axios.post(import.meta.env.VITE_REGISTER, formData);
            setIsOk('¡Usuario registrado exitosamente!');

            setTimeout(() => {
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }, 2000);
        } catch (error: any) {
            console.log("Error:", error);
            setErrors('Error al crear el usuario. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Registrarse';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="max-w-md w-full">
                <div className="text-center">
                    <div className="flex justify-center">

                    </div>
                    <h1 className="mt-6 text-3xl font-extrabold text-indigo-500 uppercase tracking-wider">
                        Wallet
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Crea tu cuenta en la App de Wallet
                    </p>
                </div>

                <div className=" bg-gray-100  p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-indigo-600">
                                Nombre
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-indigo-600" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                                    placeholder="Escribé tú nombre"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-indigo-600">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                                    placeholder="Escribé tú email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-600">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-indigo-600" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-sm mt-2 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:bg-gray-100 focus:outline-none"
                                    placeholder="Escribé la contraseña"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:indigo-lime-500 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Registrarse
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-gray-400">¿Ya tenes cuenta?{" "}</span>
                            <Link 
                                to="/auth/login" 
                                className="font-medium text-indigo-600 "
                            >
                                Iniciá sesión
                            </Link>
                        </div>
                    </form>

                    {errors && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
                            {errors}
                        </div>
                    )}

                    {isOk && (
                        <div className="mt-4 p-3 bg-green-900/50 border border-green-500/50 text-green-200 rounded-lg text-sm text-center">
                            {isOk}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register