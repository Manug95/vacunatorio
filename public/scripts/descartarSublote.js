import { funcionEnviarPost } from "./httpRequests.js";
import { getElementById, getFormInputValue } from "./frontUtils.js";
import { validarFormularioDescarte, setValidInputStyle } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const enviar = funcionEnviarPost("/sublotes/descartar");
  const sublote = getFormInputValue("sublote");
  
  if (sublote.length > 0) setValidInputStyle("sublote");

  getElementById("descartar-sublote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    formValues.sublote = sublote;
    
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