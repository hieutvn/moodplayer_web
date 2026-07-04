import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './components/App';
import Login from './components/Login';

const routes = createBrowserRouter([

  {
    path: '/',
    element: <Login />,
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
