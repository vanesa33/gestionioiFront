import logoDeIoI from './img/logoDeIoI.jpg';
export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `
    <div style="font-family: Arial; padding: 20px;">

     

      <h1 style="text-align:center">Orden Técnica Nº ${orden.numorden}</h1>

      <h3>Datos del Cliente</h3>
      <div style="border:1px solid #000; padding:10px; margin-bottom:15px;">
        <p><strong>Nombre:</strong> ${orden.nombre} ${orden.apellido}</p>
        <p><strong>Teléfono:</strong> ${orden.telefono}</p>
      </div>

      <h3>Datos del Equipo</h3>
      <div style="border:1px solid #000; padding:10px; margin-bottom:15px;">
        <p><strong>Equipo:</strong> ${orden.equipo}</p>
        <p><strong>N° Serie:</strong> ${orden.nserie}</p>
        <p><strong>Falla:</strong> ${orden.falla}</p>
        <p><strong>Observaciones:</strong> ${orden.observa}</p>
      </div>

      <h3>Costos</h3>
      <div style="border:1px solid #000; padding:10px; margin-bottom:15px;">
        <p><strong>Costo Estimado:</strong> ${orden.costo}</p>
        <p><strong>Repuesto:</strong> ${orden.repuesto}</p>
        <p><strong>Mano de Obra:</strong> ${orden.manoobra}</p>
        <p><strong>Total:</strong> ${orden.total}</p>
           <tr><th>Garantia</th><td></td></tr>
      </div>

      <p><strong>Creado por:</strong> ${orden.usuario_nombre}</p>

    </div>
  `;

 

  <p></p>
   

    

  ventana.document.write(contenidoHTML);

  ventana.document.close();

  // 👉 MUY IMPORTANTE: esperamos a que cargue el contenido antes de imprimir
  ventana.onload = () => {
    ventana.print();
  };
}





