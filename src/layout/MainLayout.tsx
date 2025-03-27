import React from 'react'
import { Nav } from '../components/Nav/Nav'
import { Outlet, useLocation } from 'react-router-dom'


export const MainLayout = () => {

    const location = useLocation();

    const ocultarNav = ['/'];

    return (
        <>
          {!ocultarNav.includes(location.pathname) && <Nav />}
          <Outlet />
        </>
      );
}
