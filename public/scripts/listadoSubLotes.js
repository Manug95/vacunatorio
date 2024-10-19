import { getElementById, removerClases } from "./frontUtils.js";
import { renderizarTablaStock, crearFilaMensajeDeTablaStock } from "./tablaStock.js";
import Paginador from "./paginador.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFormSelect } from "./validaciones.js";

const rutaDescarte = "/sublotes/descartar?sublote=";

document.addEventListener("DOMContentLoaded", () => {
  const paginador = new Paginador();
  paginador.setFuncionEnviarPeticionPaginador(eventoClicksDeLasPaginasDelPaginador(paginador.instanciaPaginador));

  getElementById("consultar-btn").addEventListener("click", async () => {
    const selectDeposito = getElementById("provincia");
    
    if (!validarSelectDelDeposito(selectDeposito)) return;
    
    const id = selectDeposito.value;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);
    const limit = paginador.resultadosPorPagina;

    const datos = await enviarPeticion(id, { offset: 0, limit, order, orderType });
    
    if (datos) {
      const { sublotes, depositoSeleccionado } = datos;
      
      if (sublotes.length > 0) {
        renderizarTablaStock(sublotes, depositoSeleccionado, rutaDescarte);
        paginador.cantidadPaginadores = datos.paginadores;
      } else {
        paginador.resetCantidadPaginadores();
        crearFilaMensajeDeTablaStock("NO HAY STOCK EN ESTE DEPOSITO");
      }
    } else {
      paginador.resetCantidadPaginadores();
      crearFilaMensajeDeTablaStock("NO SE PUDO CARGAR EL STOCK DEL DEPOSITO");
    }

    paginador.actualizarPaginador();
  });

  const paginadorElement = getElementById("paginador");

  paginadorElement.firstElementChild.addEventListener("click", paginador.setNavegacion("izq"));
  paginadorElement.lastElementChild.addEventListener("click", paginador.setNavegacion("der"));
});

function eventoClicksDeLasPaginasDelPaginador(paginador) {
  return async () => {
    const idProvinciaSeleccionada = getElementById("provincia").value;

    const offset = (paginador.paginaActual - 1) * paginador.resultadosPorPagina;
    const limit = paginador.resultadosPorPagina;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);

    const datos = await enviarPeticion(idProvinciaSeleccionada, { offset, limit, order, orderType });
    
    if (datos) {
      renderizarTablaStock(datos.sublotes, datos.depositoSeleccionado, rutaDescarte);
    } else {
      paginador.resetCantidadPaginadores();
      crearFilaMensajeDeTablaStock("NO SE PUDO CARGAR EL STOCK DEL DEPOSITO");
    }

    paginador.actualizarPaginador();
  }
}

async function enviarPeticion(id, { offset, limit, order, orderType }) {
  let url = `/sublotes/listado/${id}`;

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

function validarSelectDelDeposito(select) {
  let isValid = true;

  if (!validarFormSelect(select.value)) {
    setInvalidInputStyle("provincia");
    isValid = isValid && false;
  } else {
    removerClases(select, "is-invalid");
  }

  return isValid;
}