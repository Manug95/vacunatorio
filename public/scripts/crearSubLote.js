import { enviarPOST } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFormSelect, validarInputNumberPositivo } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getElementById("crear-sublote-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormCrearSublote(formValues)) {
      enviar(formValues);
    }

  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/sublotes", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Sublote enviado");
}

function getFormValues() {
  return {
    tipoVacuna: getFormInputValue("vacuna"),
    cantidad: getFormInputValue("cantidad"),
    deposito: getFormInputValue("deposito-nacional"),
    provincia: getFormInputValue("provincia"),
    solicitud: getFormInputValue("solicitud")
  };
}

function validarFormCrearSublote(values) {
  let isValid = true;

  if (!validarFormSelect(values.tipoVacuna)) {
    setInvalidInputStyle("vacuna");
    isValid = isValid && false;
  } else {
    setValidInputStyle("vacuna");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.deposito)) {
    setInvalidInputStyle("deposito-nacional");
    isValid = isValid && false;
  } else {
    setValidInputStyle("deposito-nacional");
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