const imprimirOrdenBuscarUno = (orden) => {
  const ventana = window.open("", "_blank");

  ventana.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }

          /* Contenedor general */
          .contenido {
            padding-bottom: 120px; /* espacio para el footer */
          }

          /* Footer fijo abajo */
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            border-top: 1px solid #000;
          }

          h1 {
            text-align: center;
            margin-top: 0;
          }

          /* Recuadro de firma con espacio mayor */
          .firma {
            margin-top: 50px; /* Más separación del último recuadro */
            text-align: center;
          }

          .firma-linea {
            margin-top: 40px; /* baja la línea de firma */
            border-top: 1px solid black;
            width: 250px;
            margin-left: auto;





