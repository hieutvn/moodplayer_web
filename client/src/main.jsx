import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './components/App.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';


const routes = createBrowserRouter([

  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/dashboard',
    element: <App />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
)
