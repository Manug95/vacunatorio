import { funcionEnviarPost } from "./httpRequests.js";
import { getElementById, getFormInputValue } from "./frontUtils.js";
import { validarFormularioDescarte, setValidInputStyle } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const enviar = funcionEnviarPost("/minilotes/descartar");
  const distribucion = getFormInputValue("distribucion");
  
  if (distribucion.length > 0) setValidInputStyle("distribucion");

  getElementById("descartar-dist-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    formValues.distribucion = distribucion;
    
    if (validarFormularioDescarte(formValues)) {
      await enviar(formValues);
    }

  });
});

function getFormValues() {
  return {
    fecha: getFormInputValue("fecha"),
    codigo: getFormInputValue("codigo"),
    formaDescarte: getFormInputValue("forma-descarte"),
    motivo: getFormInputValue("motivo")
  };
}