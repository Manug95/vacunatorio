import { enviarPOST } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFormSelect, validarInputNumberPositivo } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getElementById("redistribucion-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormRedistribuir(formValues)) {
      await enviar(formValues);
    }

  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/minilotes/redistribuir", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Vacunas enviadas");
}

function getFormValues() {
  return {
    distribucion: getFormInputValue("distribucion"),
    cantidad: getFormInputValue("cantidad"),
    centroDestino: getFormInputValue("destino")
  };
}

function validarFormRedistribuir(values) {
  let isValid = true;

  if (!validarFormSelect(values.centroDestino)) {
    setInvalidInputStyle("destino");
    isValid = isValid && false;
  } else {
    setValidInputStyle("destino");
    isValid = isValid && true;
  }

  if (!validarInputNumberPositivo(values.cantidad)) {
    setInvalidInputStyle("cantidad");
    isValid = isValid && false;
  } else {
    setValidInputStyle("cantidad");
    isValid = isValid && true;
  }

  return isValid;
}