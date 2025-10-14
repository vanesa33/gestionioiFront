export function imprimirIngreso(ingreso) {
  const ventana = window.open("", "_blank", "width=800,height=600");
  
  const estilo = `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
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
      <img src="../src/img/logo-ioi.jpeg" alt="Logo Empresa">
    </div>
    <h1>Orden Técnica N° ${ingreso.numorden}</h1>
    <h2>Fecha: ${ingreso.fecha}</h2>
    
    <table>
      <tr><th>Cliente</th><td>${ingreso.client_id}</td></tr>
      <tr><th>Equipo</th><td>${ingreso.equipo}</td></tr>
      <tr><th>Falla</th><td>${ingreso.falla}</td></tr>
      <tr><th>Observaciones</th><td>${ingreso.observa}</td></tr>
      <tr><th>N° Serie</th><td>${ingreso.nserie || "—"}</td></tr>
      <tr><th>Costo Estimado</th><td>$${ingreso.costo || "—"}</td></tr>
    </table>
    
    ${ingreso.imagenurl ? `
      <div class="imagenOrden">
        <h3>Imagen del Equipo</h3>
        <img src="${ingreso.imagenurl}" alt="Imagen del equipo">
      </div>
    ` : ""}
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