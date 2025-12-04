export function imprimirOrdenBuscarUno(orden) {
  const ventana = window.open("", "_blank");

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }

          .contenido {
            padding-bottom: 120px;
          }

          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            border-top: 1px solid #000;
            background: white;
          }

          h1 {
            text-align: center;
            margin-top: 0;
          }

          .firma {
            margin-top: 50px;
            text-align: center;
          }

          .firma-linea {
            margin-top: 40px;
            border-top: 1px solid black;
            width: 250px;
            margin-left: auto;
            margin-right: auto;
          }
        </style>
      </head>

      <body>
        <h1>Orden Técnica Nº ${orden.numorden}</h1>

        <div class="contenido">
          <p><strong>Cliente:</strong> ${orden.client_nombre}</p>
          <p><strong>Equipo:</strong> ${orden.equipo}</p>
          <p><strong>Falla:</strong> ${orden.falla}</p>
          <p><strong>Fecha:</strong> ${orden.fecha}</p>

          <div class="firma">
            <p>Firma del Cliente</p>
            <div class="firma-linea"></div>
          </div>
        </div>

        <footer>
          © Servicio Técnico – Página 1
        </footer>

      </body>
    </html>
  `;

  ventana.document.write(html);
  ventana.d
