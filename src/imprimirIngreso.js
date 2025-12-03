import logoDeIoI from './img/logoDeIoI.jpg';

export function imprimirIngreso(ingreso) {
  const ventana = window.open("", "_blank", "width=900,height=600");

  const estilo = `
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 20px 30px;
        color: #333;
      }

      /* --- Encabezado --- */
      .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #cc0000;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }
      .encabezado img {
        max-height: 60px;
      }
      .empresa {
        text-align: right;
        font-size: 13px;
      }

      /* --- Título --- */
      h1 {
        text-align: center;
        font-size: 22px;
        margin: 5px 0;
      }
      h2 {
        text-align: center;
        font-size: 16px;
        margin-bottom: 12px;
        color: #555;
      }

      /* --- Tabla compacta --- */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        font-size: 13px;
      }
      th {
        background: #f2f2f2;
        width: 180px;
        padding: 6px;
        border: 1px solid #ccc;
      }
      td {
        padding: 6px;
        border: 1px solid #ccc;
      }

      .seccion {
        margin-top: 20px;
        font-size: 15px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        padding-bottom: 4px;
      }

      /* --- Firma compacta --- */
      .firma {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
      }
      .firma div {
        width: 45%;
        padding-top: 35px;
        border-top: 1px solid #555;
        text-align: center;
        font-size: 13px;
      }

      /* --- Imagen reducida para no romper 1 hoja --- */
      .imagenOrden img {
        max-width: 250px;
        max-height: 250px;
        object-fit: cover;
        border: 1px solid #999;
        padding: 5px;
        margin-top: 10px;
      }

      .imagenOrden {
        text-align: center;
        margin-top: 10px;
      }

      /* --- Footer fijo (permite que todo quede en 1 hoja) --- */
      .footer {
        position: fixed;
        bottom: 20px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #444;
        padding-top: 8px;
        border-top: 2px solid #cc0000;
        background: white;
      }

      /* --- Evitar saltos de página --- */
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .footer { 
          position: fixed; 
        }
      }
    </style>
  `;

  const contenido = `
    <div class="encabezado">
      <img src="${logoDeIoI}" alt="Logo Empresa">
      <div class="empresa">
        <strong>IOI S.A.</strong><br>
        Servicio Técnico Especializado<br>
        www.ioi-sa.com.ar
      </div>
    </div>

    <h1>Orden Técnica N° ${ingreso.numorden}</h1>
    <h2>Fecha: ${new Date(ingreso.fecha).toLocaleDateString()}</h2>

    <div class="seccion">Datos del Cliente</div>
    <table>
      <tr><th>Cliente</th><td>${ingreso.nombre || ""} ${ingreso.apellido || ""}</td></tr>
      <tr><th>Teléfono</th><td>${ingreso.telefono || "—"}</td></tr>
    </table>

    <div class="seccion">Datos del Servicio</div>
    <table>
      <tr><th>Equipo</th><td>${ingreso.equipo || "—"}</td></tr>
      <tr><th>Falla</th><td>${ingreso.falla || "—"}</td></tr>
      <tr><th>Observaciones</th><td>${ingreso.observa || "—"}</td></tr>
      <tr><th>N° Serie</th><td>${ingreso.nserie || "—"}</td></tr>
      <tr><th>Costo Estimado</th><td>$${ingreso.costo || "—"}</td></tr>
      <tr><th>Repuestos</th><td>${ingreso.repuesto || "—"}</td></tr>
      <tr><th>Mano de Obra</th><td>${ingreso.manoobra || "—"}</td></tr>
      <tr><th>Total</th><td>$${ingreso.total || "—"}</td></tr>
      <tr><th>IVA</th><td>${ingreso.iva || "—"}</td></tr>
      <tr><th>Salida</th><td>${ingreso.salida || "—"}</td></tr>
      <tr><th>Creado por</th><td>${ingreso.usuario_nombre || "—"}</td></tr>
    </table>

    <div class="firma">
      <div>Técnico</div>
      <div>Conforme Cliente</div>
    </div>

    ${
      ingreso.imagenurl
        ? `
          <div class="imagenOrden">
            <strong>Imagen del Equipo</strong><br>
            <img src="${ingreso.imagenurl}">
          </div>
        `
        : ""
    }

    <div class="footer">
      Servicio Técnico Centro: M.T. de Alvear 2181 3º10 CABA — 011 3690-5558 · 
      Servicio Técnico Pompeya: Carlos Berg 3492 CABA — 011 3103-4611 · 
      Email: info@ioi-sa.com.ar
    </div>
  `;

  ventana.document.write(`
    <html>
      <head><title>Orden Técnica</title>${estilo}</head>
      <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  ventana.print();
}
