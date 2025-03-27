import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import axios, { AxiosError } from "axios";
import { authService } from "../services/authService";

interface LoginResponse {
  access_token: string;
}

export const Login = () => {
  const loginSchema = z.object({
    email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  });

  const navigate = useNavigate();

  type LoginForm = z.infer<typeof loginSchema>;

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string>("");
  const [isOk, setIsOk] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsOk("");
    setIsLoading(true);

    try {
      loginSchema.parse(formData);
      
      const response = await axios.post<LoginResponse>(
        import.meta.env.VITE_LOGIN,
        formData
      );

      const token = response.data.access_token;

      if (token) {
        localStorage.setItem('tokenStorage', token);

        const userData = await authService();
        if (userData) {
          setIsOk('Inicio de sesión exitoso');
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          throw new Error('No se pudo obtener la información del usuario');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors[0].message);
      } else if (error instanceof AxiosError) {
        setErrors(error.response?.data?.message || "Error al iniciar sesión. Por favor, intente nuevamente.");
      } else {
        setErrors("Error inesperado. Por favor, intente nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login";

    const checkAuth = async () => {
      const token = localStorage.getItem('JWT');
      if (token) {
        const userData = await authService();
        if (userData) {
          navigate('/home');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full ">
        <div className="text-center">
          <div className="flex justify-center">

          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-indigo-500 uppercase tracking-wider">
            Wallet
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Inicio de sesión en Wallet
          </p>
        </div>

        <div className=" bg-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-500">
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
                  placeholder="Escribí tu email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo-500">
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
                  placeholder="Escribí tu contraseña"
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
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">¿No tenés cuenta?{" "}</span>
              <Link
                to="/auth/register"
                className="font-medium text-indigo-500 transition-colors duration-200"
              >
                Registrate
              </Link>
            </div>
          </form>

          {errors && (
            <div className="mt-4 p-3 bg-red-200 border border-red-500/50 text-red-700 font-semibold rounded-lg text-sm text-center">
              {errors}
            </div>
          )}

          {isOk && (
            <div className="mt-4 p-3 bg-green-700 border border-green-500/50 text-green-100 font-semibold rounded-lg text-sm text-center">
              {isOk}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;