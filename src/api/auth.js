import axios from './axios';


export const registerRequest = async (user) => axios.post(`/register`, user);

export const loginRequest =  async (data) => axios.post(`/login`,  data);


export const verifyTokenRequest = async () => axios.post(`/verify`);








/*export const verifyTokenRequest = () => {
    return axios.get("http://localhost:4000/verifytoken", {
       headers: {
        Authorization:`Bearer ${token}`
       }
    }, );
};*/
    
