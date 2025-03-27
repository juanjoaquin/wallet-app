import { BadgeDollarSign, CreditCard, Home, IdCard, LogOut, ShieldHalf, Swords, UserRoundCheck, Users2, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService';
import axios from 'axios';

export const Nav = () => {

    const token = localStorage.getItem('tokenStorage');

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            if (!token) return;

            try {
                const userData = await authService();
                setUser(userData);
            } catch (error) {
                console.log(error)
            }
        }
        getUser();
    }, [token]);

    const handleLogout = async () => {
        if (!token) return;

        try {
            await axios.post(import.meta.env.VITE_LOGOUT, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.removeItem('tokenStorage');
            setUser(null);
            setTimeout(() => {
                navigate('/')
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>

            <nav className=" mt-2 bottom-0 w-full bg-gray-100 py-1 flex justify-around items-center border-t border-t-indigo-500/40 fixed  ">
                {user ? (
                    <>
                        <Link to="/home" className="flex flex-col items-center text-gray-300">
                            <Home size={20} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Inicio</span>
                        </Link>

                        <Link to="/transferencias" className="flex flex-col items-center text-gray-300">
                            <Wallet size={20} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Transferencias</span>
                        </Link>

                        <Link to="/pagos" className="flex flex-col items-center text-gray-300">
                            <BadgeDollarSign size={20} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Pagos</span>
                        </Link>

                        <Link to="/tarjeta/recargar-wallet" className="flex flex-col items-center text-gray-300">
                            <CreditCard size={20} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Tarjeta</span>
                        </Link>


                        <button onClick={handleLogout} className="flex flex-col items-center text-gray-300">
                            <LogOut size={24} className="text-red-800" />
                            <span className="text-xs text-red-800">Salir</span>
                        </button>
                    </>
                ) : (
                    <>

                        <Link to="/auth/login" className="flex flex-col items-center text-gray-300">
                            <UserRoundCheck size={24} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Iniciar sesion</span>
                        </Link>

                        <Link to="/auth/register" className="flex flex-col items-center text-gray-300">
                            <IdCard size={24} className="text-indigo-500" />
                            <span className="text-xs text-indigo-400">Registrarse</span>
                        </Link>



                    </>
                )}



            </nav>
        </div>
    )
}
