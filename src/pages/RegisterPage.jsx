
import {useForm} from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { useEffect } from 'react';
import {AuthProvider}  from '../context/authProvider';
import { useNavigate, Link } from 'react-router-dom';


function RegisterPage() {

    
    const {register, handleSubmit, formState: {
        errors
    }} = useForm();
    const {signup, isAuthenticated, errors: RegisterErrors} = useAuth();
    const navigate = useNavigate();

    useEffect( () => {
        if(isAuthenticated) navigate ("/tasks")
    }, [isAuthenticated, navigate] );

    

  const onSubmit = handleSubmit( async (values) => {

       try {
        await signup(values);
       } catch (error) {
        console.error("Singup error:", error.response?.data || error.message);
        
       }
 
   });

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="bg-zinc-800 max-w-md p-10 rounded-md" >
        {   
            Array.isArray(RegisterErrors) &&
            RegisterErrors.map((error, i) => (
                <div key={i} className='bg-red-500 p-2 text-white'>
                    {error}
                    </div>
            ))
        }            
        <form 

        onSubmit={onSubmit}

               
        >
            <input
             type="text"
             {... register("username", {required: true })} 
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              placeholder='username'
            />
            {
                errors.username && (
                    <p className='text-red-500'>
                        Username is required
                    </p>
                )
            }
            <input type="email" {... register("email", {required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" 
            placeholder='Email'
            />
            {
                errors.email && (
                    <p className='text-red-500'>
                        email is required
                    </p>
                )
            }
            <input type="password" {... register("password", {required: true })} 
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" 
            placeholder='Password'
            />
            {
                errors.password && (
                    <p className='text-red-500'>
                        password is required
                    </p>
                )
            }

            {
                RegisterErrors &&
                RegisterErrors.find((err) => err.toLowerCase().includes("email"))  && (
                    <p className='text-red-500'>
                        {RegisterErrors.find((err) => err.toLowerCase().includes("email"))}
                    </p>
                )
            }
            <input type="text" {... register("role", {required: true })} 
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" 
            placeholder='Rol'
            />
            {
                errors.role && (
                    <p className='text-red-500'>
                        rol is required
                    </p>
                )
            }
            <button type="submit">
                Register
            </button>
        </form>
         <br></br>
        <p className='flex gap-x-2 justify-between'>
          Don't have an account? <Link to="/login"
          className='text-sky-500'><b>Login</b></Link>
        </p>
        </div>
        </div>
    );
}

export default RegisterPage