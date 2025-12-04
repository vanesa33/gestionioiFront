import logoDeIoI from './img/logoDeIoI.jpg';
export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `

   
    <div style="font-family: Arial; padding: 20px;">

     <div class="encabezado" display: flex justify-content: space-between  align-items: center border-bottom: 2px solid #cc0000 padding-bottom: 10px margin-bottom: 15px>
      <img src="${logoDeIoI}" alt="Logo Empresa" max-height: 60px>
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
      <div><h5>La garantía cubre únicamente defectos de reparación durante el periodo acordado no incluye daños por mal uso</h5></div>

    </div>

    <div class="firma">import logoDeIoI from './img/logoDeIoI.jpg';

export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `
    <html>
      <head>
        <title>Orden Técnica Nº ${orden.numorden}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            position: relative;
            min-height: 95vh;
          }

          /* LOGO CENTRADO */
          .logo-centro {
            text-align: center;
            margin-bottom: 10px;
          }

          .logo-centro img {
            width: 120px;
            height: auto;
          }

          /* ENCABEZADO */
          .empresa {
            text-align: center;
            font-size: 14px;
            margin-bottom: 15px;
          }

          h1 {
            text-align: center;
            margin-top: 0;
          }

          .box {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 15px;
          }

          /* FIRMAS */
          .firma {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            font-size: 16px;
            padding: 0 20px;
          }

          /* FOOTER FIJO */
          .footer {
            position: absolute;
            bottom: 10px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #444;
            padding-top: 10px;
            border-top: 1px solid #ccc;
          }
        </style>
      </head>

      <body>

        <!-- LOGO CENTRADO -->
        <div class="logo-centro">
          <img src="${logoDeIoI}" alt="Logo Empresa">
        </div>

        <!-- DATOS EMPRESA -->
        <div class="empresa">
          <strong>IOI S.A.</strong><br>
          Servicio Técnico Especializado<br>
          www.ioi-sa.com.ar
        </div>

        <h1>Orden Técnica Nº ${orden.numorden}</h1>


        <h3>Datos del Cliente</h3>
        <div class="box">
          <p><strong>Nombre:</strong> ${orden.nombre} ${orden.apellido}</p>
          <p><strong>Teléfono:</strong> ${orden.telefono}</p>
        </div>


        <h3>Datos del Equipo</h3>
        <div class="box">
          <p><strong>Equipo:</strong> ${orden.equipo}</p>
          <p><strong>N° Serie:</strong> ${orden.nserie}</p>
          <p><strong>Falla:</strong> ${orden.falla}</p>
          <p><strong>Observaciones:</strong> ${orden.observa}</p>
        </div>


        <h3>Costos</h3>
        <div class="box">
          <p><strong>Costo Estimado:</strong> ${orden.costo}</p>
          <p><strong>Repuesto:</strong> ${orden.repuesto}</p>
          <p><strong>Mano de Obra:</strong> ${orden.manoobra}</p>
          <p><strong>Total:</strong> ${orden.total}</p>
          <p><strong>Garantía:</strong> ${orden.garantia ?? ""}</p>
        </div>

        <p><strong>Creado por:</strong> ${orden.usuario_nombre}</p>

        <div><h5>La garantía cubre únicamente defectos de reparación durante el periodo acordado. No incluye daños por mal uso.</h5></div>

        <div class="firma">
          <div>Técnico</div>
          <div>Conforme Cliente</div>
        </div>


        <!-- FOOTER ABAJO SIEMPRE -->
        <div class="footer">
          Servicio Técnico Centro: M.T. de Alvear 2181 3º10 CABA — 011 3690-5558 · 
          Servicio Técnico Pompeya: Carlos Berg 3492 CABA — 011 3103-4611 · 
          Email: info@ioi-sa.com.ar
        </div>

      </body>
    </html>
  `;

  ventana.document.write(contenidoHTML);
  ventana.document.close();

  ventana.onload = () => ventana.print();
}




