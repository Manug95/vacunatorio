import { getElementById, removerClases } from "./frontUtils.js";
import { renderizarTablaStock, crearFilaMensajeDeTablaStock } from "./tablaStock.js";
import Paginador from "./paginador.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFormSelect } from "./validaciones.js";

const rutaDescarte = "/minilotes/descartar?dist=";

document.addEventListener("DOMContentLoaded", () => {
  const paginador = new Paginador();
  paginador.setFuncionEnviarPeticionPaginador(eventoClicksDeLasPaginasDelPaginador(paginador.instanciaPaginador));

  getElementById("consultar-btn").addEventListener("click", async () => {
    const selectCentro = getElementById("centro");
    
    if (!validarSelectDelCentro(selectCentro)) return;
    
    const id = selectCentro.value;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);
    const limit = paginador.resultadosPorPagina;

    const datos = await enviarPeticion(id, { offset: 0, limit, order, orderType });
    console.log(datos.distribuciones)
    if (datos) {
      const { distribuciones, centroSeleccionado } = datos;
      
      if (distribuciones.length > 0) {
        renderizarTablaStock(distribuciones, centroSeleccionado, rutaDescarte);
        paginador.cantidadPaginadores = datos.paginadores;
      } else {
        paginador.resetCantidadPaginadores();
        crearFilaMensajeDeTablaStock("NO HAY STOCK EN ESTE CENTRO DE VACUNACION");
      }
    } else {
      paginador.resetCantidadPaginadores();
      crearFilaMensajeDeTablaStock("NO SE PUDO CARGAR EL STOCK DEL CENTRO DE VACUNACION");
    }

    paginador.actualizarPaginador();
  });

  const paginadorElement = getElementById("paginador");

  paginadorElement.firstElementChild.addEventListener("click", paginador.setNavegacion("izq"));
  paginadorElement.lastElementChild.addEventListener("click", paginador.setNavegacion("der"));
});

function eventoClicksDeLasPaginasDelPaginador(paginador) {
  return async () => {
    const idCentroSeleccionado = getElementById("centro").value;

    const offset = (paginador.paginaActual - 1) * paginador.resultadosPorPagina;
    const limit = paginador.resultadosPorPagina;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);

    const datos = await enviarPeticion(idCentroSeleccionado, { offset, limit, order, orderType });
    
    if (datos) {
      renderizarTablaStock(datos.distribuciones, datos.centroSeleccionado, rutaDescarte);
    } else {
      paginador.resetCantidadPaginadores();
      crearFilaMensajeDeTablaStock("NO SE PUDO CARGAR EL STOCK DEL CENTRO DE VACUNACION");
    }

    paginador.actualizarPaginador();
  }
}

async function enviarPeticion(id, { offset, limit, order, orderType }) {
  let url = `/minilotes/listado/${id}`;

  const queryParams = formarQueryParams({ offset, limit, order, orderType });
  if (queryParams) url += `?${queryParams}`;

  return await enviarGET(url);
}

function formarQueryParams({ offset, limit, order, orderType }) {
  const op = [];

  if (offset || limit || order || orderType) {
    if (offset && offset >= 0) op.push(`offset=${offset}`);
    if (limit) op.push(`limit=${limit}`);
    if (order) op.push(`order=${order}`);
    if (orderType) op.push(`orderType=${orderType}`);
  }

  return op.join("&");
}

function obtenerOpcionesDeConsulta(paginador) {
  const cantResults = getElementById("cantidad-resultados").value;
  const orden = getElementById("orden").value;
  const tipoOrden = getElementById("tipo-orden").value;

  const order = orden !== "" ? orden : null;
  const orderType = tipoOrden !== "" ? tipoOrden : null;

  if (cantResults !== "") paginador.resultadosPorPagina = +cantResults;

  return { order, orderType };
}

function validarSelectDelCentro(select) {
  let isValid = true;

  if (!validarFormSelect(select.value)) {
    setInvalidInputStyle("centro");
    isValid = isValid && false;
  } else {
    removerClases(select, "is-invalid");
  }

  return isValid;
}