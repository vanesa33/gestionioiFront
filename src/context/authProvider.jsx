import { useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import {AuthContext } from './authContext';
import Cookies from 'js-cookie';




export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [isAuthenticated,  setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    
     useEffect(() => {
      if (errors.length > 0 ) {
        const timer = setTimeout(() => {
            setErrors([])
        }, 5000 )
        return () => clearTimeout(timer)
      }
    }, [errors])   



    const signup = async (user) => {
        
        
        try {

            
            const res = await registerRequest(user);
         
          // setErrors([]);
            
        console.log(res.data);
        setUser(res.data);
        setIsAuthenticated(true);
        setErrors([]);
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
            console.error("signup error:", error.response?.data || error.message);
            const resData = error.response.data;

            if(Array.isArray(resData.errors)) {
                setErrors(resData.errors);

            } else if (typeof resData === 'string') {
                setErrors([resData]);

            } else if (resData?.message) {
                setErrors([resData.message]);
            }else {
                setErrors(['Error desconocido al registrarse.']);
            }
        }
    };

    const signin = async (user, navigate) => {

        try {
            setErrors([]);
            const res = await loginRequest(user)
           console.log(res)


            // if (!res || !res.data || !res.data.token) {
      //throw new Error("Token inválido o no recibido");}
     
                // Cookies.set("token", res.data.token);


            setIsAuthenticated(true)
            setUser(res.data.user)
            navigate("/");

        } catch (err) {
            
            const message = err.response?.data?.message || 'Error de pasword'
            
            setErrors([message])
            setErrors([err.response?.data?.message || 'Error desconocido al iniciar sesión.']);
            console.error("signin error:", err.response?.data || err.message);
        }
    }
    
    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
    };
   
//a partir de aqui va el viejo cod
    
useEffect(() => {
  const checkLogin = async () => {
    try {
      const res = await verifyTokenRequest(); // ⚠️ No pases el token, axios lo manda con la cookie

      if (res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.warn("No autenticado:", error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  checkLogin();
}, []);
    

    return (
        <AuthContext.Provider 
        value={{
            
             signup, 
             signin,             
             logout,
             loading,
             user,
             isAuthenticated,
             errors
              }}>
            {children}
        </AuthContext.Provider>
    );
};