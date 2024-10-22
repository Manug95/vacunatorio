import { funcionEnviarPost } from "./httpRequests.js";
import { getElementById, getFormInputValue } from "./frontUtils.js";
import { validarFormSolicitarMinilote, setValidInputStyle } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const enviar = funcionEnviarPost("/solicitudes/minilote");

  [...document.getElementsByTagName("select")].forEach(s => {
    s.addEventListener("change", () => setValidInputStyle(s.id));
  });

  getElementById("solicitar-minilote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormSolicitarMinilote(formValues)) {
      await enviar(formValues);
    }

  });

});

function getFormValues() {
  return {
    tipoVacuna: getFormInputValue("vacuna"),
    cantidad: getFormInputValue("cantidad"),
    centro: getFormInputValue("centro")
  };
}