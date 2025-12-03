import logoDeIoI from '../img/logoDeIoI.jpg';

export function imprimirIngreso(ingreso) {
  const ventana = window.open("", "_blank", "width=800,height=600");

  const estilo = `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
      h1 { text-align: center; font-size: 22px; margin-bottom: 10px; }
      h2 { text-align: center; font-size: 18px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
      th { background-color: #f4f4f4; }
      .logo { text-align: center; margin-bottom: 20px; }
      .logo img { max-height: 80px; }
      .imagenOrden { text-align: center; margin-top: 15px; }
      .imagenOrden img { max-width: 300px; border: 1px solid #ccc; padding: 5px; }
    </style>
  `;

  const contenido = `
    <div class="logo">
      <img src={logoDeIoI} alt="Logo Empresa" className='w-40 mb-4 rounded-full mx-auto'>
    </div>
    <h1>Orden Técnica N° ${ingreso.numorden}</h1>
    <h2>Fecha: ${new Date(ingreso.fecha).toLocaleDateString()}</h2>

    <table>
      <tr><th>Cliente</th><td>${ingreso.nombre || ""} ${ingreso.apellido || ""}</td></tr>
      <tr><th>Teléfono</th><td>${ingreso.telefono || "—"}</td></tr>
      <tr><th>Equipo</th><td>${ingreso.equipo || "—"}</td></tr>
      <tr><th>Falla</th><td>${ingreso.falla || "—"}</td></tr>
      <tr><th>Observaciones</th><td>${ingreso.observa || "—"}</td></tr>
      <tr><th>N° Serie</th><td>${ingreso.nserie || "—"}</td></tr>
      <tr><th>Costo Estimado</th><td>$${ingreso.costo || "—"}</td></tr>
      <tr><th>Repuesto</th><td>${ingreso.repuesto || "—"}</td></tr>
      <tr><th>Mano de Obra</th><td>${ingreso.manoobra || "—"}</td></tr>
      <tr><th>Total</th><td>$${ingreso.total || "—"}</td></tr>
      <tr><th>IVA</th><td>${ingreso.iva || "—"}</td></tr>
      <tr><th>Presupuesto</th><td>${ingreso.presu || "—"}</td></tr>
      <tr><th>Salida</th><td>${ingreso.salida || "—"}</td></tr>
      <tr><th>Creado por</th><td>${ingreso.usuario_nombre || "—"}</td></tr>
    </table>

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
