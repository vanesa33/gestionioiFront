import {useForm} from 'react-hook-form'
import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
 
const {register,
     handleSubmit,
    formState: {errors},
} = useForm();
const {signin, errors: signinErrors, isAuthenticated} = useAuth();
const navigate = useNavigate()
const onSubmit = handleSubmit((data) => {
            console.log("enviando datos de login", data);
            signin(data);
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
 
    <img src="../src/img/logo-ioi.jpeg" alt="Logo" className="w-40 mb-4" />
    <h1 className="text-2xl font-bold">Instalaciones Odontológicas Integrales</h1>
    <p className="text-sm mt-2">SISTEMA DE TKT</p>
  </div>
  
        
        
        <div className="w-1/2 flex flex-col justify-center items-center px-8">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 w-full max-w-sm text-white" >
            <img src="/logo-in.jpeg" alt="50" className='w-40 mb-4 rounded-full mx-auto'/>
            
           

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

                    

            <input type="password"
             {... register("password", {required: true })} 
            className="w-full p-2 mb-6 rounded bg-white bg-opacity-90 text-black" 
            placeholder='Password'
            autoComplete='current-password'

            />
            {
                errors.password && (
                    <p className='text-red-900 mt-2 mb-4'>
                        password is required
                    </p>
                )
            }




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
