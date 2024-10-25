import { enviarPOST } from "./httpRequests.js";
import { getElementById, getFormInputValue, mostrarMensaje } from "./frontUtils.js";
import { setInvalidInputStyle, setValidInputStyle, validarFecha, validarFormSelect } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getElementById("registrar-paciente-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = getFormValues();
    
    if (validarFormulario(formValues)) {
      await enviar(formValues);
    }

  });
});

async function enviar(formValues) {
  const respuesta = await enviarPOST("/pacientes", formValues);
  mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Paciente Registrado");
}

function getFormValues() {
  return {
    nombres: getFormInputValue("nombres"),
    apellidos: getFormInputValue("apellidos"),
    fechaNac: getFormInputValue("fechaNac"),
    dni: getFormInputValue("dni"),
    email: getFormInputValue("email"),
    telefono: getFormInputValue("telefono"),
    genero: getFormInputValue("genero"),
    localidad: getFormInputValue("localidad"),
    provincia: getFormInputValue("provincia"),
  };
}

function validarFormulario(values) {
  // let isValid = true;
  const mapaValidador = new Map([
    ["nombres", validarNombrePaciente],
    ["apellidos", validarNombrePaciente],
    ["fechaNac", validarFecha],
    ["dni", validarDNI],
    ["email", validarEmail],
    ["telefono", validarTelefono],
    ["genero", validarGenero],
    ["localidad", validarLocalidad],
    ["provincia", validarFormSelect]
  ]);

  return Object.keys(values)
  .map(v => {
    const result = mapaValidador.get(v)(values[v]);
    if (result) { setValidInputStyle(v); } 
    else { setInvalidInputStyle(v); }
    return result;
  })
  .every(v => v);

  // return isValid;
}

function validarNombrePaciente(nombre) {
  if (!nombre) return false;

  if (nombre.length > 50) return false;
  // if (nombre.includes(/[0-9]/g)) return false;

  return true;
}

function validarDNI(dni) {
  if (!dni) return false;

  const regex = /^\d{8}$/;
  if (!regex.test(dni)) return false;

  return true;
}

function validarEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validarGenero(genero) {
  if (!genero) return false;
  const opts = ["Femenino", "Masculino"];
  if (!opts.includes(genero)) return false;
  return true;
}

function validarLocalidad(localidad) {
  if (!localidad) return false;

  return true;
}

function validarTelefono(tel) {
  if (!tel) return false;

  const regex = /^[0-9]{10}$/;
  if (!regex.test(tel)) return  false;

  return true;
}