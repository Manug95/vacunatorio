import { getElementById, removerClases } from "./frontUtils.js";
import { renderizarTablaCslt1, crearFilaMensaje } from "./tablaStock.js";
import { enviarGET } from "./httpRequests.js";
import { setInvalidInputStyle, validarFecha } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", () => {

  getElementById("consultar-btn").addEventListener("click", async () => {
    const fInicio = getElementById("fechaInicial");
    const fFin = getElementById("fechaFin");
    
    if (!validarLasFechas(fInicio, fFin)) return;

    const datos = await enviarPeticion(fInicio.value, fFin.value);
    
    if (datos) {
      const { body } = datos;
      
      if (body.length > 0) {
        renderizarTablaCslt1(body);
      } else {
        crearFilaMensaje({ mensaje: "NO HAY LOTES COMPRADOS", idTabla: "cuerpo", cantColumnas: "3" });
      }
    } else {
      crearFilaMensaje({ mensaje: "NO SE PUDO CARGAR LA CONSULTA", idTabla: "cuerpo", cantColumnas: "3" });
    }
    
  });

});

async function enviarPeticion(fInicio, fFin) {
  const url = `/consultas/cslt1?fechaInicio=${fInicio}&fechaFin=${fFin}`;
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