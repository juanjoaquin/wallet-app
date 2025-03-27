import axios from 'axios';
import { ArrowRightSquareIcon, BadgeX, Eye, EyeOff, SquareArrowUpRight, UserCircle2, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import NotificacionIcon from '../../widget/NotificacionIcon';
import ConfirmAlert from '../../hooks/ConfirmAlert';

interface UserProps {
  id: number;
  name: string;
  email: string;
}

interface CuentaProps {
  id: number;
  user_id: number;
  saldo: number;
  alias: string;
  created_at: string;
  user: UserProps;
}

interface HistorialProps {
  id: number;
  tipo: string;
  cuenta_emisor_id: number;
  cuenta_receptor_id: number;
  monto: number;
  created_at: string;
}

interface TarjetaProp {
  id: number;
  numero_tarjeta: string;
  tipo: string;
  fecha_vencimiento: Date;
  CVV: string;
  created_at: string;
}

export const HomeAuth = () => {

  const [userCuenta, setUserCuenta] = useState<CuentaProps | null>(null);
  const [transferencias, setTransferencias] = useState<HistorialProps[]>([]);
  const [tarjetaUser, setTarjetaUser] = useState<TarjetaProp | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tarjetaToDelete, setTarjetaToDelete] = useState<TarjetaProp | null>(null);

  const [showSaldo, setShowSaldo] = useState(false);

  const toggleBalance = () => {
    setShowSaldo(!showSaldo);
  }

  const token = localStorage.getItem('tokenStorage');
  const navigate = useNavigate();

  useEffect(() => {

    document.title = "Home"

    if (!token) {
      setTimeout(() => {
        navigate('auth/login')
      }, 1000);
      return;
    }

    const getAccount = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_CUENTA_USER, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserCuenta(response.data.cuenta);
      } catch (error) {
        console.log(error);
      }
    }

    const getTransferencias = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_TRANSACCIONES_HISTORIAL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransferencias(response.data.historial);
      } catch (error) {
        console.log(error)
      }
    }

    const getTarjeta = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_TARJETA_USER, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTarjetaUser(response.data.tarjeta);
      } catch (error) {
        console.log(error)
      }
    }

    getTransferencias();
    getAccount();
    getTarjeta();

  }, []);

  const handleDeleteTarjeta = async (tarjeta: TarjetaProp) => {
    setTarjetaToDelete(tarjeta);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (tarjetaToDelete) {
      try {
        await axios.delete(import.meta.env.VITE_DELETE_TARJETA, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTarjetaUser(null);
      } catch (error) {
        console.log(error);
      }
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className='bg-gray-100 p-6 min-h-screen'>
      {userCuenta ? (
        <div>
          <div className='flex items-center justify-between'>
            <p className='text-gray-800 text-xl'>Hola, <span className='font-semibold'>{userCuenta.user.name}</span></p>
            <div className='bg-gray-50  rounded-lg'>
              <NotificacionIcon />
            </div>
          </div>

          <div className='mt-4'>
            <div className=' px-4 py-6 space-y-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg'>
              <p className='text-sm text-gray-300'>Total balance</p>
              <span className='text-2xl text-gray-100 font-semibold flex items-center gap-4'>
                {showSaldo ? `$${userCuenta.saldo}` : '$****'}
                <button onClick={toggleBalance} className='p-1 bg-gray-300/30 rounded-full'>
                  {showSaldo ? <EyeOff size={20} className='text-gray-300' /> : <Eye size={20} className='text-gray-300' />}
                </button>
              </span>
              <div className='text-sm text-gray-200'>
                <p>Alias: <span className='font-medium'>{userCuenta.alias}</span></p>
              </div>
            </div>
          </div>

          <div className='mt-4'>
            {tarjetaUser ? (
              <div>
                <div className='p-4 bg-gray-50 border border-indigo-600/40 shadow-sm rounded-lg'>
                  <Link to="/tarjeta/recargar-wallet">
                    <p className='text-gray-700 text-sm'>Número de Tarjeta</p>
                    <p className='text-lg font-semibold'>{tarjetaUser.numero_tarjeta.replace(/\d{12}(\d{4})/, '**** **** **** $1')}</p>
                    <div className='flex justify-between mt-2 text-sm text-gray-600'>
                      <p> <span className='font-medium capitalize'>{tarjetaUser.tipo}</span></p>
                      <p>Vence: <span className='font-medium'>{new Date(tarjetaUser.fecha_vencimiento).toLocaleDateString()}</span></p>
                    </div>
                  </Link>
                </div>
                <div className='flex flex-row-reverse px-1 mt-2'>
                  <div className=' bg-red-200 rounded-sm'>
                    <p
                      onClick={() => handleDeleteTarjeta(tarjetaUser)}
                      className='flex items-center gap-1 text-sm text-red-800 font-light px-2'>
                      <BadgeX size={16} />Desvincular tarjeta
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='px-4 bg-gray-50 rounded-lg py-2'>
                <p className='text-gray-600'>Aún no tenes tarjeta registrada. </p>
                <Link to='/tarjeta/asociar-tarjeta'>
                  <span className='font-semibold text-gray-800 flex items-center gap-2'>Haceló <span><ArrowRightSquareIcon size={18} /></span></span>
                </Link>
              </div>
            )}
          </div>

          <div className='mt-4 flex justify-between'>
            <div className='flex items-center gap-2 bg-white px-4 rounded-lg'>
              <span><Wallet className='text-indigo-500 font-medium' size={18} /></span>
              <span className='font-medium text-gray-600'>#{userCuenta.id}</span>
            </div>

            <div className='flex items-center gap-2 bg-white px-4 rounded-lg'>
              <span><UserCircle2 size={18} className='text-indigo-500 font-medium' /></span>
              <span className='font-medium text-gray-600'>#{userCuenta.user_id}</span>
            </div>
          </div>

          <div className='mt-6'>
            <div className='flex items-center justify-between'>
              <Link to='/transferencias'>
                <h2 className='text-gray-800 text-xl'>Ultimas transferencias</h2></Link>
              <Link to='/transferencias'>
                <SquareArrowUpRight size={20} /></Link>
            </div>

            <div className='mt-4'>
              {transferencias.length > 0 ? (
                <>
                  {transferencias.slice(0, 4).map((trans) => (
                    <div key={trans.id} className='flex flex-col bg-gray-50 px-2 py-2 rounded-lg mt-2'>
                      <div className='flex justify-between items-center '>
                        <div className='flex flex-col '>
                          <p className='font-medium capitalize text-gray-800'> {trans.tipo}</p>
                          <p className='text-sm text-gray-500'>{new Date(trans.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900'>  {trans.tipo === 'recargo' ? '+' : trans.cuenta_emisor_id === userCuenta.id ? '-' : '+'} ${trans.monto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className='bg-gray-50 py-2 px-2 rounded-sm'>

                  <div>
                    No contas con transferencias aún
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center space-y-4'>
          <h1 className='text-4xl text-indigo-500 font-semibold'>Bienvenido!</h1>
          <h3 className='text-gray-700 font-light text-lg'>Ya tenés tu usuario. Para operar en nuestra Wallet, ahora <span className='font-semibold text-gray-900'>debes crearte la Billetera</span></h3>
          <div >
            <Link className='w-full px-12 rounded-lg mt-2 text-lg font-medium text-gray-100 uppercase py-2 bg-gradient-to-r from-indigo-600 to-violet-600' to='/cuenta/crear-wallet'>Crear Wallet</Link>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmAlert
          message="¿Estás seguro de que deseas desvincular esta tarjeta?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};
