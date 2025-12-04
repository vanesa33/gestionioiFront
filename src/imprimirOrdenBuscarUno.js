mport logoDeIoI from './img/logoDeIoI.jpg';

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
      padding: 20px;
      position: relative;
      min-height: 95vh;
    }

    .logo-centro {
      text-align: center;
      margin-bottom: 10px;
    }

    .logo-centro img {
      width: 120px;
      height: auto;
    }

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

    .firma {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      font-size: 16px;
      padding: 0 20px;
    }

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
