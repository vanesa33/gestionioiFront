import * as XLSX from "xlsx-js-style";

export function exportarIngresosExcel(ingresos, user) {


  const mostrarMonto = (v) => (Number(v) > 0 ? Number(v) : "");

  // 🔹 Total general según lo que esté filtrado en pantalla
  const totalGeneral = ingresos.reduce(
    (acc, i) => acc + (Number(i.total) || 0),
    0
  );

  // 🔹 Datos normales (SIN total acumulado como columna)
  const data = ingresos.map((i) => ({
    "N° Orden": i.numorden,
 "Cliente": i.cliente_nombre,
    "Tipo de Orden": i.tipo_orden || "",
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
    "Salida": i.salida
      ? new Date(i.salida).toLocaleDateString("es-AR")
      : "",
  }));

  // ---------------------------
// Agregar fila final con Total Acumulado
// ---------------------------

// Fila vacía para separación visual
data.push({});

// Crear fila personalizada
const filaTotal = {};

// Inicializar todas las columnas vacías
Object.keys(data[0]).forEach((col) => {
  filaTotal[col] = "";
});

// Colocar texto y total
filaTotal["IVA"] = "Total Acumulado:";
filaTotal["Total"] = totalGeneral;

// Agregar al final
data.push(filaTotal);

 

  const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data, { origin: "A5" });
//esto permite que el total acumulado quede justo debajo de la última fila de datos, sin importar cuántas filas haya.

  const range = XLSX.utils.decode_range(ws["!ref"]);

  XLSX.utils.sheet_add_aoa(ws, [
    ["Reporte de Ordenes"],
    [`Usuario: ${user || "Usuario Desconocido"}`],
    [`Fecha: ${new Date().toLocaleString()}`],  
    []
    
  ], { origin: "A1" });

  // 🔵 Resaltar SOLO las celdas IVA y Total del Total Acumulado
const lastRow = range.e.r;

// Buscar índice de columnas
const headers = Object.keys(data[0]);
const colIVA = headers.indexOf("IVA");
const colTotal = headers.indexOf("Total");

// Estilo personalizado
const estiloTotal = {
  fill: { fgColor: { rgb: "D9E1F2" } },
  font: { bold: true, color: { rgb: "000000" } },
  alignment: { horizontal: "right", vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  },
};

// Aplicar estilo solo a esas 2 celdas
const cellIVA = ws[XLSX.utils.encode_cell({ r: lastRow, c: colIVA })];
const cellTotal = ws[XLSX.utils.encode_cell({ r: lastRow, c: colTotal })];

if (cellIVA) cellIVA.s = estiloTotal;
if (cellTotal) {cellTotal.s = { ...estiloTotal, numFmt: "$#,##0.00" };}

  // 🔵 Estilo encabezado
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (cell) {
      cell.s = {
        fill: { fgColor: { rgb: "1F4E78" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }

  
  
  ws["!freeze"] = { rows: 1 };
  ws["!cols"] = Object.keys(data[0]).map(() => ({ width: 20 }));

  XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
  XLSX.writeFile(wb, "Ingresos.xlsx");
}
