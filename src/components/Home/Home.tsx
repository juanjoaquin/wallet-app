import imageHome from '../../assets/images/imagen-home.jpg'
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="relative">
        <img src={imageHome} className="w-full h-full object-cover " alt="wallet" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div>
          <h1 className='text-indigo-600 font-semibold text-3xl '>
            Wallet, la billetera virtual del momento
          </h1>
          <h3 className='text-gray-500 text-sm text-start mt-4 '>
            La aplicación donde podrás realizar todo tipo de pagos, transferir dinero, y mucho más.
          </h3>

          <div className='mt-4'>
            <div className="w-full flex justify-evenly ">
              <div className='border border-indigo-500 px-6 py-2 rounded-lg'>
                <Link to="/auth/register" className='text-indigo-600 font-semibold'>Registrarse</Link>
              </div>

              <div className=' bg-indigo-500 px-6 py-2 rounded-lg'>
                <Link to="/auth/login" className='text-gray-100 font-semibold'>Iniciar sesión</Link>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};