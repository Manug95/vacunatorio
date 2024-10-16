import { funcionEnviarPostEnDescarte } from "./httpRequests.js";
import { getElementById, getFormInputValue } from "./frontUtils.js";
import { validarFormularioDescarte } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const enviar = funcionEnviarPostEnDescarte("/lotes/descartar");

  getElementById("descartar-lote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormularioDescarte(formValues)) {
      await enviar(formValues);
    }

  });
});

function getFormValues() {
  return {
    lote: getFormInputValue("lote"),
    fecha: getFormInputValue("fecha"),
    codigo: getFormInputValue("codigo"),
    formaDescarte: getFormInputValue("forma-descarte"),
    motivo: getFormInputValue("motivo")
  };
}