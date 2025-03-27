import { AtSign, DollarSign, Info, User, Search, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Contacto } from '../Contacto/Contacto';
import axios from 'axios';

interface Contacto {
  id: number;
  name: string;
  alias?: string;
}

export const TransferenciaForm = () => {
  const [error, setError] = useState<string>('');
  const [isOk, setIsOk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [showContactos, setShowContactos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contactosRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('tokenStorage');
  const navigate = useNavigate();

  const transferenciaSchema = z.object({
    receptor_id: z.number().nullable(),
    alias: z.string().nullable(),
    monto: z.number().min(1, 'Debe ser al menos $1')
  });

  type TransferenciaForm = z.infer<typeof transferenciaSchema>;

  const [formData, setFormData] = useState<TransferenciaForm>({
    receptor_id: null,
    alias: null,
    monto: 1
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactosRef.current && !contactosRef.current.contains(event.target as Node)) {
        setShowContactos(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contactos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setContactos(response.data.contactos);
      } catch (error) {
        console.error('Error al cargar contactos:', error);
      }
    };

    fetchContactos();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'receptor_id' || name === 'monto') {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? null : Number(value)
      }));
    } else if (name === 'alias') {
      setFormData(prev => ({
        ...prev,
        alias: value === "" ? null : value
      }));
    }
  };

  const handleContactSelect = (contacto: Contacto) => {
    setFormData(prev => ({
      ...prev,
      receptor_id: contacto.id ? Number(contacto.id) : null,
      alias: contacto.alias || null
    }));
    setShowContactos(false);
  };

  const filteredContactos = contactos.filter(contacto =>
    contacto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contacto.id && contacto.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsOk('');
    setIsLoading(true);

    try {
      transferenciaSchema.parse(formData);

      await axios.post(import.meta.env.VITE_TRANSFERIR, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setIsOk('La operación fue aprobada');

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setError('Error al transferir');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecipient = () => {
    setFormData(prev => ({
      ...prev,
      receptor_id: null,
      alias: null
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-gray-50 rounded-[30px] p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Transferir plata</h2>

        <div className="mb-6 bg-blue-50 rounded-[20px] p-4">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Puedes seleccionar un contacto de tu lista o ingresar manualmente los datos del destinatario.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative" ref={contactosRef}>
            <button
              type="button"
              onClick={() => setShowContactos(prev => !prev)}
              className="w-full text-left p-4 bg-white rounded-[15px] shadow-sm border border-gray-200 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-500">
                {formData.alias || formData.receptor_id
                  ? `Destinatario: ${formData.alias || formData.receptor_id}`
                  : 'Seleccionar contacto'}
              </span>
              {(formData.alias || formData.receptor_id) && (
                <X
                  className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecipient();
                  }}
                />
              )}
            </button>

            {showContactos && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-[15px] shadow-xl border border-gray-200">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar contacto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredContactos.length > 0 ? (
                    filteredContactos.map((contacto) => (
                      <button
                        key={contacto.id}
                        type="button"
                        onClick={() => handleContactSelect(contacto)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contacto.name}</p>
                          <p className="text-sm text-gray-500">
                            {contacto.alias || contacto.id}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No se encontraron contactos</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {!formData.receptor_id && !formData.alias && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="number"
                  name="receptor_id"
                  value={formData.receptor_id ?? ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-4 text-lg border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition-colors bg-gray-50 rounded-t-lg"
                  placeholder="CVU del destinatario"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  name="alias"
                  defaultValue={formData.alias ?? ""}
                  onBlur={(e) => handleChange(e)}
                  className="block w-full pl-10 pr-3 py-4 text-lg border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition-colors bg-gray-50 rounded-t-lg"
                  placeholder="Alias del destinatario"
                />
              </div>
            </>
          )}

          <div className="relative mt-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-4 text-3xl font-bold text-center border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition-colors bg-gray-50 rounded-t-lg"
              placeholder="0"
              min="1"
              step="0.01"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              Monto mínimo $1
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {isOk && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
              {isOk}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white py-4 px-6 rounded-[15px] text-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </div>
            ) : (
              'Enviar Dinero'
            )}
          </button>
        </form>
      </div>
      <div>
        <Contacto />
      </div>
    </div>
  );
};

export default TransferenciaForm;