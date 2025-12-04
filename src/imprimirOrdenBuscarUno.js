export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `
    <div style="font-family: Arial; padding: 20px;">

     const contenido = `
    <div class="encabezado">
      <img src="${logoDeIoI}" alt="Logo Empresa">
      <div class="empresa">
        <strong>IOI S.A.</strong><br>
        Servicio Técnico Especializado<br>
        www.ioi-sa.com.ar
      </div>
    </div>

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

  <div><h5>La garantía cubre únicamente defectos de reparación durante el periodo acordado no incluye daños por mal uso</h5></div>

  <p></p>
    <div class="firma">
      <div>Técnico</div>
      <div>Conforme Cliente</div>
    </div>

    <div class="footer">
      Servicio Técnico Centro: M.T. de Alvear 2181 3º10 CABA — 011 3690-5558 · 
      Servicio Técnico Pompeya: Carlos Berg 3492 CABA — 011 3103-4611 · 
      Email: info@ioi-sa.com.ar
    </div>
  `;

  ventana.document.write(contenidoHTML);

  ventana.document.close();

  // 👉 MUY IMPORTANTE: esperamos a que cargue el contenido antes de imprimir
  ventana.onload = () => {
    ventana.print();
  };
}


