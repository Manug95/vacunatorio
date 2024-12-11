import { getElementById, removerClases, mostrarMensaje, createElement, mostrarElemento, ocultarElemento } from "./frontUtils.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFecha, validarFormSelect } from "./validaciones.js";

const tabla = getElementById("tabla-consultas");

document.addEventListener("DOMContentLoaded", () => {

  getElementById("consultar-btn").addEventListener("click", async () => {
    const fInicio = getElementById("fechaInicial");
    const fFin = getElementById("fechaFin");
    const consultaSeleccionada = getElementById("select_consulta").value;
    
    if (!validarLasFechas(fInicio, fFin)) return;

    const datos = await enviarPeticion({ consulta: consultaSeleccionada, fInicio: fInicio.value, fFin: fFin.value });
    
    if (datos) {
      const { registros, columnas } = datos;
      
      if (registros.length > 0) {
        renderizarTabla(columnas, registros);
      } else {
        mostrarMensaje(false, "NO HAY RESULTADOS");
      }
    } else {
      mostrarMensaje(false, "NO SE PUDO CARGAR LA CONSULTA");
    }
    
  });

  getElementById("consultar-btn-cslt5").addEventListener("click", async () => {
    tabla.innerHTML = "";
    const lugar = getElementById("lugar");
    const consultaSeleccionada = getElementById("select_consulta").value;
    
    if (!validarLugarCslt5(lugar)) return;

    const datos = await enviarPeticion({ consulta: consultaSeleccionada, lugar: lugar.value });
    
    if (datos) {
      const { registros, columnas } = datos;
      
      if (registros.length > 0) {
        renderizarTabla(columnas, registros);
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
      ocultarElemento("select-cslt5");
      return;
    } else {
      ocultarElemento("form-rango-fechas");
    }

    if (consultaSeleccionada === "cslt5") {
      mostrarElemento("select-cslt5");
      ocultarElemento("form-rango-fechas");
      return;
    } else {
      ocultarElemento("select-cslt5");
    }

    const datos = await enviarPeticion({ consulta: consultaSeleccionada });

    if (datos) {
      const { registros, columnas } = datos;
      
      if (registros.length > 0) {
        renderizarTabla(columnas, registros);
      } else {
        mostrarMensaje(false, "NO HAY RESULTADOS");
      }
    } else {
      mostrarMensaje(false, "NO SE PUDO CARGAR LA CONSULTA");
    }

  });

});

function renderizarTabla(columnas, datos) {
  const tableHead = createElement("thead", { id: "table-head" }, "table-light");
  const trHead = createElement("tr", { id: "table-row-head" });

  columnas.forEach(c => {
    const th = createElement("th", { content: c }, "text-center");
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

async function enviarPeticion({ consulta, fInicio, fFin, lugar }) {
  let url = `/consultas/${consulta}`;
  if (fFin && fInicio) url += `?fechaInicio=${fInicio}&fechaFin=${fFin}`;
  if (lugar) url += `?loc=${lugar}`;
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

function validarLugarCslt5(lugar) {
  let isValid = true;

  if (!validarFormSelect(lugar.value)) {
    setInvalidInputStyle("lugar");
    isValid = isValid && false;
  } else {
    removerClases(lugar, "is-invalid");
  }

  return isValid;
}