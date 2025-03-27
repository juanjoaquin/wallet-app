import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ContactoList } from './ContactoList';

interface ContactoProps {
    id: number;
    name: string;
    pivot: {
        user_id: number;
    }
}

export const Contacto = () => {

    const [contactos, setContactos] = useState<ContactoProps[]>([]);

    const token = localStorage.getItem('tokenStorage');
    const navigate = useNavigate();

    useEffect(() => {

        if (!token) {
            setTimeout(() => {
                navigate('/auth/login');
            }, 1000);
            return;
        }

        const getContactos = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CONTACTOS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setContactos(response.data.contactos);
            } catch (error) {
                console.log(error);
            }
        }
        getContactos();
    }, []);

    const handleDelete = async (contactoId: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${import.meta.env.VITE_DELETE_CONTACTO}/${contactoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setContactos((prevContactos) =>
                prevContactos.filter(contacto => contacto.id !== contactoId)
            );

            alert(`Has eliminado al contacto`);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
            <div>
                <h1 className='text-gray-800 mt-4 text-xl mb-4 font-semibold'>Contactos </h1>
                <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Podes agregar a otros usuarios a tu lista de contacto.  <Link to="/contactos/agregar-contacto" className='text-indigo-500 font-semibold underline'>Agregar</Link></span>
                    </p>
                </div>
            </div>

            <ContactoList contactos={contactos} handleDelete={handleDelete} />
        </div>
    )
}
