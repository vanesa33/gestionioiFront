import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/authProvider';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import TasksFormPage from './pages/TasksFormPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

import ProtectedRoute from './ProtectedRoute';
import TaskProvider   from './context/TasksProvider';
import TasksFromClientIng from './pages/TasksFormClientIng';
import Navbar from './components/Navbar';
import TasksBuscarCliente from './pages/TasksBuscarCliente';
import TasksBuscarOrden from './pages/TasksBuscarOrden';
import EditarOrden from './pages/EditarOrden';
import BuscarOrden from './pages/BuscarOrden';
import EditClientForm from './pages/EditClientForm';
import TasksOrdenesTecnico from './pages/TasksOrdenesTecnico';
import UserList from './pages/UserList';
//import UserIngresosPage from './pages/UserIngresosPage';



function App(){

 const handleClientSubmit = data => {
    console.log('Recibí el cliente:', data);
 }

  return (
    
    <AuthProvider>
      <TaskProvider>
      <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      

      <Route element={<ProtectedRoute/>}>
      <Route path='/' element={<HomePage />} />
      <Route path='/taskmy' element={<TasksPage />} />
      <Route
              path='/api/add-task'
              element={<TasksFromClientIng onClientSubmit={handleClientSubmit} />}
            />
      <Route path='/tasks/:id' element={<TasksFromClientIng />} /> 
      <Route path='/tasks/buscar' element={<TasksBuscarCliente />} />
      <Route path='/ingresos/todos' element={<TasksBuscarOrden />} />

     <Route path='/ingresos/delete' element={<TasksBuscarOrden />} />

      <Route path='/profile' element={<ProfilePage />} />

      <Route path='/ingresos' element={<TasksFormPage />} />

      <Route path='/ingresos/orden' element={<BuscarOrden />} />

      <Route path='/ingresos/nuevo' element={<TasksFormPage />} /> 

      <Route path='/ingresos/:iid' element={<EditarOrden />} />

      <Route path='/ingresos/poruser' element={<TasksOrdenesTecnico />} />

            <Route path='/users' element={<TasksOrdenesTecnico />} />


      <Route path='/tasks/edit/:id' element={<EditClientForm />} />

            <Route path='/usuarios' element={<UserList />} />





      </Route>     
      
    </Routes>

  </BrowserRouter>
    </TaskProvider>

    </AuthProvider>
  )
}

export default App;


/* <Route path='/inicio' element={<h1>Inicio</h1>} />
      <Route path='/tkt' element={<h1>Orden de Reparación</h1>} />
      <Route path='/ingreso' element={<h1>Ingresar Orden y Cliente</h1>} />
      <Route path='/listado' element={<h1>Lista Completa</h1>} />
      <Route path='/admin' element={<h1>Inicio de Administrador</h1>} />
      <Route path='/tecnico' element={<h1>Inicio</h1>} />
      <Route path='/facturacion' element={<h1>Inicio</h1>} />
      <Route path='/usuarios' element={<h1>Usuarios</h1>} />
      <Route path='/busquetkt' element={<h1>Busqueda por tkt's y técnicos</h1>} />*/