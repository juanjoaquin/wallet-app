import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import { Register } from './auth/Register';
import { Home } from './components/Home/Home';
import { HomeAuth } from './components/Home/HomeAuth';
import { TransferenciaContainer } from './components/Transferencia/TransferenciaContainer';
import { TransferenciaForm } from './components/Transferencia/TransferenciaForm';
import { TarjetaForm } from './components/Tarjeta/TarjetaForm';
import { TarjetaRecargoForm } from './components/Tarjeta/TarjetaRecargoForm';
import { PagosContainer } from './components/Pagos/PagosContainer';
import { PagoDetail } from './components/Pagos/PagoDetail';
import { Notificaciones } from './components/Notificaciones/Notificaciones';
import { MainLayout } from './layout/MainLayout';
import { ProtectedRoutes } from './helpers/ProtectedRoutes';
import { ContactoForm } from './components/Contacto/ContactoForm';
import { CuentaForm } from './components/Cuenta/CuentaForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        <Route element={<MainLayout />}>

          <Route element={<ProtectedRoutes />}>

            <Route path="/home" element={<HomeAuth />} />
            <Route path="/transferencias" element={<TransferenciaContainer />} />
            <Route path="/transferencias/transferir-a-persona" element={<TransferenciaForm />} />
            <Route path="/tarjeta/asociar-tarjeta" element={<TarjetaForm />} />
            <Route path="/tarjeta/recargar-wallet" element={<TarjetaRecargoForm />} />
            <Route path="/pagos" element={<PagosContainer />} />
            <Route path="/pagos/:pagoId" element={<PagoDetail />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/contactos/agregar-contacto" element={<ContactoForm />} />
            <Route path="/cuenta/crear-wallet" element={<CuentaForm />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
