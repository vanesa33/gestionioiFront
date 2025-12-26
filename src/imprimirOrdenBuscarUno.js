import logoDeIoI from './img/logoDeIoI.jpg';

 function formatearFecha(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-AR");
 }

export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `<!DOCTYPE html>
  
<html>
<head>
  <title>Orden Técnica Nº ${orden.numorden}</title>
  <style>
  /* =======================
     CONFIGURACIÓN IMPRESIÓN
     ======================= */
  @page {
    size: A4;
    margin: 10mm;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
      font-size: 12px;
    }
  }

  /* =======================
     ESTILOS GENERALES
     ======================= */
  body {
    font-family: Arial, sans-serif;
    padding: 0;
    position: relative;
    min-height: 100%;
  }

  p {
    margin: 2px 0;
  }

  h1 {
    text-align: center;
    font-size: 18px;
    margin: 5px 0;
  }

  h3 {
    font-size: 14px;
    margin: 5px 0;
  }

  /* =======================
     LOGO Y EMPRESA
     ======================= */
  .logo-centro {
    text-align: center;
    margin-bottom: 5px;
  }

  .logo-centro img {
    width: 90px;
    height: auto;
  }

  .empresa {
    text-align: center;
    font-size: 12px;
    margin-bottom: 8px;
  }

  /* =======================
     CAJAS
     ======================= */
  .box {
    border: 1px solid #000;
    padding: 4px;
    margin-bottom: 4px;
    page-break-inside: avoid;
  }

  /* =======================
     COSTOS EN 2 COLUMNAS
     ======================= */
  .costos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
  }

  /* =======================
     FIRMA
     ======================= */
  .firma {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
    padding: 0 20px;
    page-break-inside: avoid;
  }

  /* =======================
     FOOTER FIJO
     ======================= */
  .footer {
    position: fixed;
    bottom: 5mm;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 10px;
    color: #444;
    padding-top: 5px;
    border-top: 1px solid #ccc;
  }
</style>

</head>

<body>

  <div class="logo-centro">
    <img src="${logoDeIoI}" alt="Logo Empresa" />
  </div>

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
    <p><strong>Tipo de Orden:</strong> ${orden.tipo_orden}</p>
    <p><strong>Equipo:</strong> ${orden.equipo}</p>
    <p><strong>N° Serie:</strong> ${orden.nserie}</p>
    <p><strong>Falla:</strong> ${orden.falla}</p>
   <p><strong>Fecha de Ingreso:</strong> ${formatearFecha(orden.fecha)}</p>
    <p><strong>Observaciones:</strong> ${orden.observa}</p>
  </div>

  <h3>Costos</h3>
  <div class="box costos">
     <p><strong>Garantía:</strong> ${orden.presu}</p>
    <p><strong>Repuesto:</strong> ${orden.repuesto}</p>
    <p><strong>Mano de Obra:</strong> ${orden.manoobra}</p>
    <p><strong>Total:</strong> ${orden.total}</p>
    <p><strong>Salida:</strong> ${formatearFecha(orden.salida)}</p>

   
     
  </div>
  <p><strong>Creado por:</strong> ${orden.usuario_nombre}</p>

  <div class="firma">
    <div>Técnico</div>
    <div>Conforme Cliente</div>
  </div>

  <div class="footer">
    Servicio Técnico Centro: M.T. de Alvear 2181 3º10 CABA — 011 3690-5558 · 
    Servicio Técnico Pompeya: Carlos Berg 3492 CABA — 011 3103-4611 · 
    Email: info@ioi-sa.com.ar
  </div>

</body>
</html>`;

  ventana.document.write(contenidoHTML);
  ventana.document.close();
  ventana.onload = () => ventana.print();
}

















