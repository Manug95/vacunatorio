import { getElementById, removerClases } from "./frontUtils.js";
import { renderizarTablaStock, crearFilaMensajeDeTablaStock } from "./tablaStock.js";
import Paginador from "./paginador.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFormSelect } from "./validaciones.js";

const rutaDescarte = "/lotes/descartar";

document.addEventListener("DOMContentLoaded", () => {
  const paginador = new Paginador();
  paginador.setFuncionEnviarPeticionPaginador(eventoClicksDeLasPaginasDelPaginador(paginador.instanciaPaginador));

  getElementById("consultar-btn").addEventListener("click", async () => {
    const selectDeposito = getElementById("deposito-nac");
    
    if (!validarSelectDelDeposito(selectDeposito)) return;
    
    const id = selectDeposito.value;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);
    const limit = paginador.resultadosPorPagina;

    const datos = await enviarPeticion(id, { offset: 0, limit, order, orderType });
    
    if (datos) {
      const { lotes, depositoSeleccionado } = datos;
      
      if (lotes.length > 0) {
        renderizarTablaStock(lotes, depositoSeleccionado, rutaDescarte);
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
    const idDepositoSeleccionado = getElementById("deposito-nac").value;

    const offset = (paginador.paginaActual - 1) * paginador.resultadosPorPagina;
    const limit = paginador.resultadosPorPagina;
    const { order, orderType } = obtenerOpcionesDeConsulta(paginador.instanciaPaginador);

    const datos = await enviarPeticion(idDepositoSeleccionado, { offset, limit, order, orderType });
    
    if (datos) {
      renderizarTablaStock(datos.lotes, datos.depositoSeleccionado, rutaDescarte);
    } else {
      paginador.resetCantidadPaginadores();
      crearFilaMensajeDeTablaStock("NO SE PUDO CARGAR EL STOCK DEL DEPOSITO");
    }

    paginador.actualizarPaginador();
  }
}

async function enviarPeticion(id, { offset, limit, order, orderType }) {
  let url = `/lotes/listado/${id}`;

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
    setInvalidInputStyle("deposito-Prov");
    isValid = isValid && false;
  } else {
    removerClases(select, "is-invalid");
  }

  return isValid;
}