import * as XLSX from "xlsx-js-style";

export function exportarIngresosExcel(ingresos) {
  if (!ingresos || ingresos.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // ---------------------------
  // 1) Convertir datos para Excel
  // ---------------------------
const mostrarMonto = (v) => (Number(v) > 0 ? Number(v) : "");

const data = ingresos.map((i) => ({
  "N° Orden": i.numorden,
  "Cliente": i.cliente_nombre || "",
  "Equipo": i.equipo || "",
  "Falla": i.falla || "",
  "Observación": i.observa || "",
  "Fecha": i.fecha ? new Date(i.fecha).toLocaleDateString("es-AR") : "",
  "N° Serie": i.nserie || "",
  "Costo": mostrarMonto(i.costo),
  "Repuesto": mostrarMonto(i.repuesto),
  "Mano de Obra": mostrarMonto(i.manoobra),
  "IVA": i.iva || "",
  "Total": mostrarMonto(i.total),
  "Garantía": i.presu ? "Sí" : "No",
  "Orden Cerrada": i.salida ? new Date(i.salida).toLocaleDateString("es-AR") : "",
}));

  // ---------------------------
  // 2) Crear workbook y worksheet
  // ---------------------------
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // ---------------------------
  // 3) Estilos
  // ---------------------------
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // --- Estilo encabezado ---
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
    const cell = ws[cell_address];

    if (cell) {
      cell.s = {
        fill: { fgColor: { rgb: "1F4E78" } }, // azul corporativo
        font: { bold: true, color: { rgb: "FFFFFF" } }, // blanco
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }
  }

  // --- Estilo filas ---
  for (let R = 1; R <= range.e.r; R++) {
    const isEven = R % 2 === 0; // filas alternadas

    for (let C = 0; C <= range.e.c; C++) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cell_address];

      if (cell) {
        cell.s = {
          fill: { fgColor: { rgb: isEven ? "F2F2F2" : "FFFFFF" } }, // gris claro / blanco
          font: { color: { rgb: "000000" } },
          alignment: { horizontal: "left", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        // Resaltar columna TOTAL si es positiva
        if (C === 11 && Number(cell.v) > 0) {
          cell.s.font.bold = true;
        }
      }
    }
  }

  // ---------------------------
  // 4) Congelar la fila de encabezado
  // ---------------------------
  ws["!freeze"] = { rows: 1 };

  // ---------------------------
  // 5) Ajustar ancho de columnas
  // ---------------------------
  ws["!cols"] = Object.keys(data[0]).map(() => ({ width: 20 }));

  // ---------------------------
  // 6) Agregar hoja al libro
  // ---------------------------
  XLSX.utils.book_append_sheet(wb, ws, "Ingresos");

  // ---------------------------
  // 7) Descargar archivo
  // ---------------------------
  XLSX.writeFile(wb, "Ingresos.xlsx");
}

