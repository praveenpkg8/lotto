import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import WinningNumber from 'src/views/WinningNumber';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import WinningCalculation from 'src/views/WinningCalculation';
import RegisterView from 'src/views/auth/RegisterView';
import PurchaseTicket from 'src/views/PurchaseTicket';
import TicketSettings from 'src/views/TicketSettings';

import { UserProvider } from 'src/contextApi/UserContext';
import { TicketProvider } from 'src/contextApi/TicketContext';

const routes = [
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      {
        path: 'winningnumbers',
        element: (
          <TicketProvider>
            <WinningNumber />
          </TicketProvider>
        )
      },
      {
        path: 'winningcalculation',
        element: (
          <UserProvider>
            <WinningCalculation />
          </UserProvider>
        )
      },
      {
        path: 'purchaseticket',
        element: (
          <TicketProvider>
            <UserProvider>
              <PurchaseTicket />
            </UserProvider>
          </TicketProvider>
        )
      },
      {
        path: 'ticketsettings',
        element: (
          <UserProvider>
            <TicketSettings />
          </UserProvider>
        )
      },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
