import logoDeIoI from './img/logoDeIoI.jpg';

export function imprimirOrdenBuscarUno(orden) {
  if (!orden) return;

  const ventana = window.open("", "_blank", "width=800,height=1000");

  const contenidoHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Orden Técnica Nº ${orden.numorden}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 15px 25px;
      font-size: 13px;              /* 🔥 Reducido para que entre más contenido */
      min-height: 100vh;
      position: relative;
    }

    h1 {
      text-align: center;
      font-size: 20px;              /* 🔥 Más pequeño */
      margin-bottom: 10px;
    }

    h3 {
      font-size: 16px;              /* 🔥 Más pequeño */
      margin: 8px 0;
    }

    .logo-centro img {
      width: 90px;                  /* 🔥 Logo más chico aún */
      height: auto;
    }

    .logo-centro {
      text-align: center;
      margin-bottom: 5px;
    }

    .empresa {
      text-align: center;
      font-size: 12px;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .box {
      border: 1px solid #000;
      padding: 8px;                 /* 🔥 menos padding */
      margin-bottom: 10px;
    }

    .box p {
      margin: 3px 0;                /* 🔥 líneas más juntas */
    }

    .firma {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;             /* 🔥 más cerca del contenido */
      padding: 0 20px;
      font-size: 13px;
    }

    .footer {
      width: 100%;
      text-align: center;
      font-size: 11px;              /* 🔥 Más pequeño */
      color: #444;
      padding-top: 8px;
      border-top: 1px solid #ccc;
      margin-top: 20px;             /* 🔥 separa sin superponer */
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







