import { getElementById, removerClases, mostrarMensaje, createElement, mostrarElemento, ocultarElemento } from "./frontUtils.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFecha } from "./validaciones.js";

const tabla = getElementById("tabla-consultas");

document.addEventListener("DOMContentLoaded", () => {

  getElementById("consultar-btn").addEventListener("click", async () => {
    const fInicio = getElementById("fechaInicial");
    const fFin = getElementById("fechaFin");
    const consultaSeleccionada = getElementById("select_consulta").value;
    
    if (!validarLasFechas(fInicio, fFin)) return;

    const datos = await enviarPeticion({ consulta: consultaSeleccionada, fInicio: fInicio.value, fFin: fFin.value });
    
    if (datos) {
      const { body } = datos;
      
      if (body.length > 0) {
        renderizarTabla(body);
      } else {
        mostrarMensaje(false, "NO HAY RESULTADOS");
      }
    } else {
      mostrarMensaje(false, "NO SE PUDO CARGAR LA CONSULTA");
    }
    
  });

  getElementById("select_consulta").addEventListener("change", async (e) => {
    tabla.innerHTML = "";
    const consultaSeleccionada = e.target.value;

    if (consultaSeleccionada === "cslt1") {
      mostrarElemento("form-rango-fechas");
      return;
    } else {
      ocultarElemento("form-rango-fechas");
    }

    const datos = await enviarPeticion({ consulta: consultaSeleccionada });
    // console.log(datos)

    if (datos) {//console.log("hola");
      const { body } = datos;
      
      if (body.length > 0) {
        renderizarTabla(body);
      } else {
        mostrarMensaje(false, "NO HAY RESULTADOS");
      }
    } else {
      mostrarMensaje(false, "NO SE PUDO CARGAR LA CONSULTA");
    }

  });

});

function renderizarTabla(datos) {
  const tableHead = createElement("thead", { id: "table-head" }, "table-light");
  const trHead = createElement("tr", { id: "table-row-head" });

  Object.keys(datos[0]).forEach(k => {
    const th = createElement("th", { content: nombreColumna(k) }, "text-center");
    trHead.appendChild(th);
  });

  tableHead.appendChild(trHead);
  tabla.appendChild(tableHead);
  const tbody = createElement("tbody", { id: "cuerpo" });
  
  datos.forEach(d => {
    const tr = createElement("tr", {});

    Object.keys(d).forEach(key => {
      tr.appendChild(createElement("td", { content: d[key].toString() }, "align-middle", "text-center", "text-break"));
    });
    
    tbody.appendChild(tr);
  });
  
  tabla.appendChild(tbody);
}

function nombreColumna(clave) {
  switch(clave) {
    case "tipo_vacuna": return "TIPO DE VACUNA";
    case "en_nacion": return "EN NACIÓN";
    case "en_provincia": return "EN PROVINCIA";
    case "en_centros_vacunac": return "EN CENTROS";
    case "aplicadas": return "APLICADAS";
    case "descartadas": return "DESCARTADAS";
    case "vencidas": return "VENCIDAS";
    case "laboratorio": return "LABORATORIO";
    case "cantidad_vacunas": return "CANTIDAD VACUNAS";
    case "fecha_compra": return "FECHA DE COMPRA";
  }
}

async function enviarPeticion({ consulta, fInicio, fFin }) {
  let url = `/consultas/${consulta}`;
  if (fFin && fInicio) url += `?fechaInicio=${fInicio}&fechaFin=${fFin}`;
  return enviarGET(url);
}

function validarLasFechas(fInicio, fFin) {
  let isValid = true;

  if (!validarFecha(fInicio.value)) {
    setInvalidInputStyle("fechaInicial");
    isValid = isValid && false;
  } else {
    removerClases(fInicio, "is-invalid");
  }

  if (!validarFecha(fFin.value)) {
    setInvalidInputStyle("fechaFin");
    isValid = isValid && false;
  } else {
    removerClases(fFin, "is-invalid");
  }

  return isValid;
}