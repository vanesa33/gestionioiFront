import { useState } from "react";
import { createTasksRequest, getTasksRequest, upDateTasksRequest } from '../api/tasks';
import { createIngresoRequest, getIngresoRequest, getTodosIngresosRequest, upDateingresoRequest, getIngresosRequest, deleteIngresoRequest, getTodosLosIngresosRequest } from "../api/ingresos";
import { TaskContext} from "./TasksContext";
import { useAuth } from "./useAuth";

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [ingresos, setIngresos] = useState([]);

    const {user} = useAuth();
    

    const getTasks = async () => {
        try {
            const res = await getTasksRequest();
        console.log(res);
        setTasks(res.data);
        } catch (error) {
            console.error("error al obtener tarea", error);
        }
    }

    const  createTask = async (task) =>{
    

     const dataWithUser = {
        ...task,
        user_id: user.id
     };
     

     const res = await createTasksRequest(dataWithUser)
              console.log(res)      
           return res.data.id;    
    };

     const getIngreso = async () => {
  try {
    const res = await getIngresoRequest();
    console.log("Datos de ingresos:", res.data);
    setIngresos(res.data); // ✅ ahora sí en el estado correcto
  } catch (error) {
    console.error("Error al obtener ingresos", error);
  }
};

const getOrdenesPorTecnico = async (id) => {
    try {
      const res = await getTodosLosIngresosRequest(id);
      return res.data; // Axios devuelve la data en .data
    } catch (error) {
      console.error("Error cargando órdenes del técnico:", error);
      return [];
    }
  };
const loadTodosIngresos = async () => {
        try {
            const res = await getTodosIngresosRequest();
        console.log(res);
        setTasks(res.data);
        return(res.data);
        } catch (error) {
            console.error("error al obtener tarea", error);
        }
    }





 const getAllIngreso = async () => {
        try {
            const res = await getIngresosRequest();
        console.log(res);
        setTasks(res.data);
        } catch (error) {
            console.error("error al obtener tarea", error);
        }
    }


    const  createIngreso = async (ingreso) =>{
     const res = await createIngresoRequest(ingreso)
        console.log("Repuesta del backend", res.data);
       // const nuevoIid = res.data.iid;
        //console.log(nuevoIid);
        //const numorden = res.data.numorden;
       // console.log(numorden);
        return res;     
      
    };

  /*const updateIngreso = async (id, ingreso) => {
    try {
        const res = await upDateingresoRequest(id, ingreso);
        console.log("Ingreso actualizado:", res.ingreso);
        return res.data;
    } catch (error) {
        console.error("Error al actualizar ingreso", error);
        throw error;
    }
}; */

const updateIngreso = async (iid, ingreso) => {
  try {
    if (!iid) {
      throw new Error("El ID (iid) es inválido o undefined");
    }

    await upDateingresoRequest(iid, ingreso);
  } catch (error) {
    console.log("Error en updateIngreso:", error);
    throw error; // Opcional: podés relanzarlo para que el que lo llame lo maneje
  }
};


const upDateTask = async (id, task) => {
  try {
    if (!id) {
      throw new Error("El id es inválido");
    }
    await upDateTasksRequest(id, task);
  }catch (error){
    console.log("Error en updateTask", error);
    throw error;
  }
};


const deleteIngreso = async (id) => {
  try {
    const res = await deleteIngresoRequest(id);
    console.log("Ingreso eliminado:", res.data);

    // Opcional: actualizá el estado eliminando el ingreso del array
   setIngresos(prev => prev.filter(ing => ing.iid !== id));

    return res.data;
  } catch (error) {
    console.error("Error al eliminar ingreso", error);
    throw error;
  }
};

    return (
        <TaskContext.Provider
         value={{           
           tasks,
           createTask, 
           setTasks,
           getTasks,
           getIngreso,
           loadTodosIngresos,
           createIngreso,
           updateIngreso,
           getAllIngreso,
           deleteIngreso,
           upDateTask,
           getOrdenesPorTecnico,
           ingresos    
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export default TaskProvider;