import { enviarPOST } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFormSelect } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getElementById("comprar-lote-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormulario(formValues)) {
      enviar(formValues);
    }

  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/lotes", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Lote de vacunas comprado");
}

function getFormValues() {
  return {
    vacuna: getFormInputValue("vacuna"),
    cantidad: getFormInputValue("cantidad"),
    deposito: getFormInputValue("deposito-nacional")
  };
}

function validarFormulario(values) {
  let isValid = true;

  if (!validarFormSelect(values.vacuna)) {
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

  if (!validarFormSelect(values.cantidad)) {
    setInvalidInputStyle("cantidad");
    isValid = isValid && false;
  } else {
    setValidInputStyle("cantidad");
    isValid = isValid && true;
  }

  return isValid;
}