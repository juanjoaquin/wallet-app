import { CircleFadingPlus, Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface ContactoProps {
    id: number;
    name: string;
    pivot: {
        user_id: number;
    };
}

interface ContactoListProps {
    contactos: ContactoProps[];
    handleDelete: (contactoId: number) => void;
}

export const ContactoList: React.FC<ContactoListProps> = ({ contactos, handleDelete }) => {
    return (
        <div>
            {contactos.length > 0 ? (
                <div className="space-y-2">
                    {contactos.map((contacto) => (
                        <p key={contacto.id} className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between ">
                            <p className="text-lg font-semibold text-gray-800">{contacto.name}</p>
                            <p className="text-sm text-gray-600">Contacto N° {contacto.id}</p>
                            <Trash2 size={20} className='text-red-700' onClick={() => handleDelete(contacto.id)} />
                        </p>
                    ))}
                </div>
            ) : (
                <div className=' mb-12 px-4 bg-gray-50 rounded-lg py-4 shadow-sm text-center' >
                    <Link to='/contactos/agregar-contacto' className='font-light text-gray-900 flex justify-center gap-4 items-center'>
                        Agrega tú primer contacto 
                        <CircleFadingPlus className='text-indigo-500'/>
                    </Link>
                    
                </div>
            )}
        </div>
    );
};
