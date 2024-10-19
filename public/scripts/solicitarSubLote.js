import { funcionEnviarPost } from "./httpRequests.js";
import { getElementById, getFormInputValue } from "./frontUtils.js";
import { validarFormSolicitarSublote, setValidInputStyle } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const enviar = funcionEnviarPost("/solicitudes/sublote");

  [...document.getElementsByTagName("select")].forEach(s => {
    s.addEventListener("change", () => setValidInputStyle(s.id));
  });

  getElementById("solicitar-sublote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormSolicitarSublote(formValues)) {
      await enviar(formValues);
    }

  });

});

function getFormValues() {
  return {
    tipoVacuna: getFormInputValue("vacuna"),
    cantidad: getFormInputValue("cantidad"),
    provincia: getFormInputValue("provincia")
  };
}