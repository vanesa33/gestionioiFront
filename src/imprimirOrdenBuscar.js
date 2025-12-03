
export function imprimirOrdenBuscar(orden) {
  if (!orden || !orden.numorden) {
    alert("No hay datos válidos para imprimir esta orden.");
    console.error("Orden inválida:", orden);
    return;
  }

  const ventana = window.open("", "_blank");

  const fecha = orden.fecha
    ? new Date(orden.fecha).toISOString().split("T")[0]
    : "";

  ventana.document.write(`
    <html>
      <head>
        <title>Orden Técnica ${orden.numorden}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }

          .logo {
            width: 150px;
            margin-bottom: 15px;
          }

          .titulo {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
          }

          .recuadro {
            border: 2px solid #000;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 6px;
          }

          .label {
            font-weight: bold;
          }

          .fila {
            margin-bottom: 6px;
          }
        </style>
      </head>

      <body>

        <img src="/logo-ioi.jpeg" class="logo" />

        <div class="titulo">ORDEN TÉCNICA N° ${orden.numorden}</div>

        <div class="recuadro">
          <div class="fila"><span class="label">Fecha:</span> ${fecha}</div>
          <div class="fila"><span class="label">Cliente:</span> ${orden.nombre} ${orden.apellido}</div>
          <div class="fila"><span class="label">Teléfono:</span> ${orden.telefono}</div>
        </div>

        <div class="recuadro">
          <div class="fila"><span class="label">Equipo:</span> ${orden.equipo}</div>
          <div class="fila"><span class="label">N° Serie:</span> ${orden.nserie}</div>
          <div class="fila"><span class="label">Falla:</span> ${orden.falla}</div>
          <div class="fila"><span class="label">Observaciones:</span> ${orden.observa}</div>
        </div>

        <div class="recuadro">
          <div class="fila"><span class="label">Costo Estimado:</span> ${orden.costo}</div>
          <div class="fila"><span class="label">Repuesto:</span> ${orden.repuesto}</div>
          <div class="fila"><span class="label">Mano de Obra:</span> ${orden.manoobra}</div>
          <div class="fila"><span class="label">IVA:</span> ${orden.iva}</div>
          <div class="fila"><span class="label">Total:</span> ${orden.total}</div>
          <div class="fila"><span class="label">Presupuesto:</span> ${orden.presu}</div>
          <div class="fila"><span class="label">Salida:</span> ${orden.salida}</div>
         <div class="fila"><span class="label">Garantia</span> </div>

        </div>

        <div class="recuadro">
          <div class="fila"><span class="label">Creado por:</span> ${orden.usuario_nombre}</div>
        </div>


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

       
      </body>
    </html>
  `);

  ventana.document.close();
}


