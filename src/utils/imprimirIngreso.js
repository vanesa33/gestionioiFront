import logoDeIoI from '../img/logoDeIoI.jpg';

export function imprimirIngreso(ingreso) {
  const ventana = window.open("", "_blank", "width=900,height=600");

  const estilo = `
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 40px;
        color: #333;
        background: #fdfdfd;
      }

      .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #cc0000;
        padding-bottom: 10px;
        margin-bottom: 25px;
      }

      .encabezado img {
        max-height: 70px;
      }

      .empresa {
        text-align: right;
        font-size: 14px;
        color: #555;
      }

      h1 {
        text-align: center;
        font-size: 26px;
        margin-bottom: 5px;
      }

      h2 {
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
        color: #555;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size: 14px;
      }

      th {
        background: #f2f2f2;
        width: 200px;
        padding: 8px;
        border: 1px solid #ccc;
        text-align: left;
      }

      td {
        padding: 8px;
        border: 1px solid #ccc;
      }

      .seccion {
        margin-top: 30px;
        font-size: 16px;
        font-weight: bold;
        color: #444;
        border-bottom: 2px solid #ddd;
        padding-bottom: 5px;
      }

      .firma {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      }

      .firma div {
        width: 45%;
        padding-top: 40px;
        border-top: 1px solid #555;
        text-align: center;
      }

      .imagenOrden {
        margin-top: 25px;
        text-align: center;
      }

      .imagenOrden img {
        max-width: 350px;
        border: 1px solid #999;
        padding: 5px;
        margin-top: 10px;
      }

      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #666;
        text-align: center;
        border-top: 2px solid #cc0000;
        padding-top: 10px;
      }
    </style>
  `;

  const contenido = `
    <div class="encabezado">
      <div><img src="${logoDeIoI}" alt="Logo Empresa"></div>
      <div class="empresa">
        <strong>IOI S.A.</strong><br>
        Servicio Técnico Especializado<br>
        www.ioi-sa.com.ar
      </div>
    </div>

    <h1>Orden Técnica N° ${ingreso.numorden}</h1>
    <h2>Fecha de Solicitud: ${new Date(ingreso.fecha).toLocaleDateString()}</h2>

    <div class="seccion">Datos del Cliente</div>
    <table>
      <tr><th>Cliente</th><td>${ingreso.nombre || ""} ${ingreso.apellido || ""}</td></tr>
      <tr><th>Teléfono</th><td>${ingreso.telefono || "—"}</td></tr>
    </table>

    <div class="seccion">Datos del Servicio</div>
    <table>
      <tr><th>Equipo</th><td>${ingreso.equipo || "—"}</td></tr>
      <tr><th>Falla Informada</th><td>${ingreso.falla || "—"}</td></tr>
      <tr><th>Observaciones</th><td>${ingreso.observa || "—"}</td></tr>
      <tr><th>N° Serie</th><td>${ingreso.nserie || "—"}</td></tr>
      <tr><th>Costo Estimado</th><td>$${ingreso.costo || "—"}</td></tr>
      <tr><th>Repuestos</th><td>${ingreso.repuesto || "—"}</td></tr>
      <tr><th>Mano de Obra</th><td>${ingreso.manoobra || "—"}</td></tr>
      <tr><th>Total</th><td>$${ingreso.total || "—"}</td></tr>
      <tr><th>IVA</th><td>${ingreso.iva || "—"}</td></tr>
      <tr><th>Fecha Estimada de Entrega</th><td>${ingreso.salida || "—"}</td></tr>
      <tr><th>Presupuesto</th><td>${ingreso.presu || "—"}</td></tr>
      <tr><th>Creado por</th><td>${ingreso.usuario_nombre || "—"}</td></tr>
    </table>

    <div class="seccion">Garantía</div>
    <p>La garantía cubre únicamente defectos de reparación durante el período acordado. No incluye daños por mal uso.</p>

    <div class="firma">
      <div>Firma del Técnico</div>
      <div>Conforme del Cliente</div>
    </div>

    ${
      ingreso.imagenurl
        ? `
        <div class="imagenOrden">
          <h3>Imagen del Equipo</h3>
          <img src="${ingreso.imagenurl}" alt="Imagen del equipo">
        </div>
      `
        : ""
    }

    <div class="footer">
      Servicio Técnico Centro: M.T. de Alvear 2181 3º 10 CABA — 011 3690-5558<br>
      Servicio Técnico Pompeya: Carlos Berg 3492 CABA — 011 3103-4611<br>
      Email: info@ioi-sa.com.ar
    </div>
  `;

  ventana.document.write(`
    <html>
      <head><title>Orden Técnica ${ingreso.numorden}</title>${estilo}</head>
      <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  ventana.print();
}
