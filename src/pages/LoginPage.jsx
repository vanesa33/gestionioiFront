import {useForm} from 'react-hook-form'
import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

function LoginPage() {

const [showPassword, setShowPassword] = useState(false);

 
const {register,
     handleSubmit,
    formState: {errors},
} = useForm();
const {signin, errors: signinErrors, isAuthenticated} = useAuth();
const navigate = useNavigate()

const onSubmit = handleSubmit(async (data) => {
  const loggedUser = await signin(data);

  if (loggedUser?.must_change_password) {
    navigate("/cambiar-password");
  } else {
    navigate("/");
  }
});

useEffect(() => {
if (isAuthenticated) navigate("/");
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated]);
          



//const onSubmit = handleSubmit((data) => {
  //  signin(data);
//});



    return (

     
    
        
        <div className="flex min-h-screen bg-red-600">
  {/* Lado izquierdo - Logo y texto */}
  <div className="w-1/2 flex flex-col justify-center items-center text-white p-8">
 
    <img src=".../public/logo-ioi.jpeg" alt="Logo" className="w-40 mb-4" />
    <h1 className="text-2xl font-bold">Instalaciones Odontológicas Integrales</h1>
    <p className="text-sm mt-2">SISTEMA DE TKT</p>
  </div>
  
        
        
        <div className="w-1/2 flex flex-col justify-center items-center px-8">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 w-full max-w-sm text-white" >
            <img src=".../public/logo-in.jpeg" alt="50" className='w-40 mb-4 rounded-full mx-auto'/>
            
           

            <h1 className='text-2xl text-center font-bold mt-2 mb-4'>Login</h1>
              
             <form onSubmit={onSubmit}>
            <input
             type="email"
              {... register("email", {required: true })}
            //className="w-full bg-zinc-200 text-black px-4 py-2 rounded-md my-2" 
              className="w-full p-2 mb-4 rounded bg-white bg-opacity-90 text-black"
            placeholder='Email'
            autoComplete='current-password'
            />
            {errors.email && <p
                     className='text-red-900 mt-2 mb-4'>
                        email is required
                    </p>}

                    

           <div className="relative mb-6">
  <input
    type={showPassword ? "text" : "password"}
    {...register("password", { required: true })}
    className="w-full p-2 pr-10 rounded bg-white bg-opacity-90 text-black"
    placeholder="Password"
    autoComplete="current-password"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>


              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded font-semibold hover:opacity-90">
        Ingresar
      </button>
          
               {   
            Array.isArray(signinErrors) &&
            signinErrors.map((error, i) => (
                <div key={i} className=' bg-black text-center text-red-700 my-2 mt-2 mb-4'>
                    {error}
                    </div>
            ))
        }

        
        </form>
          
        <p className='flex gap-x-2 justify-between'>
          Don't have an account? <Link to="/signup"
          className='text-red-900'><b>Sign up</b></Link>
        </p>

        

        </div>
        </div>
        </div>
        
        
   );
}

export default LoginPage;
