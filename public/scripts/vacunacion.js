import { enviarPOST, enviarGET } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje, createElement } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFormSelect, validarDNI } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const selectCentro = getElementById("centro");
  const selectVacunas = getElementById("vacuna");

  getElementById("vacunacion-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormulario(formValues)) {
      await enviar(formValues);
    }

  });

  selectCentro.addEventListener("change", async (e) => {
    const centroSeleccionado = selectCentro.value;
    
    const result = await enviarGET(`/minilotes/distribucion?centro=${centroSeleccionado}`);
    if (result && result.length) {
      selectVacunas.innerHTML = "";
      const disabledOption = createElement("option", { value: "", content: "Seleccionar centro", selected: true, disabled: true });
      selectVacunas.appendChild(disabledOption);

      // while (selectVacunas.firstElementChild.nextElementSibling) {
      //   selectVacunas.removeChild(selectVacunas.firstElementChild.nextElementSibling);
      // }

      if (result.length > 0) {
        result.forEach(r => {
          const option = createElement("option", { value: r.id, content: r.tipo });
          selectVacunas.appendChild(option);
        });
      } else {
        const option = createElement("option", { value: "", content: "No hay vacunas" });
        selectVacunas.appendChild(option);
      }
    }
  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/vacunacion", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Vacunación Registrada");
}

function getFormValues() {
  return {
    vacuna: getFormInputValue("vacuna"),
    centro: getFormInputValue("centro"),
    enfermero: getFormInputValue("enfermero"),
    dni: getFormInputValue("dni")
  };
}

function validarFormulario(values) {
  const mapaValidador = new Map([
    ["vacuna", validarFormSelect],
    ["centro", validarFormSelect],
    ["enfermero", validarFormSelect],
    ["dni", validarDNI]
  ]);

  return Object.keys(values)
  .map(v => {
    const result = mapaValidador.get(v)(values[v]);
    if (result) { setValidInputStyle(v); } 
    else { setInvalidInputStyle(v); }
    return result;
  })
  .every(v => v);
}