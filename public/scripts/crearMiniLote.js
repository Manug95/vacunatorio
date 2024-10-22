import { enviarPOST } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFormSelect, validarInputNumberPositivo } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getElementById("crear-sublote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormCrearMinilote(formValues)) {
      await enviar(formValues);
    }

  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/minilotes", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Vacunas enviadas");
}

function getFormValues() {
  return {
    tipoVacuna: getFormInputValue("vacuna"),
    cantidad: getFormInputValue("cantidad"),
    centro: getFormInputValue("centro"),
    provincia: getFormInputValue("provincia"),
    solicitud: getFormInputValue("solicitud")
  };
}

function validarFormCrearMinilote(values) {
  let isValid = true;

  if (!validarFormSelect(values.tipoVacuna)) {
    setInvalidInputStyle("vacuna");
    isValid = isValid && false;
  } else {
    setValidInputStyle("vacuna");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.centro)) {
    setInvalidInputStyle("centro");
    isValid = isValid && false;
  } else {
    setValidInputStyle("centro");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.provincia)) {
    setInvalidInputStyle("provincia");
    isValid = isValid && false;
  } else {
    setValidInputStyle("provincia");
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