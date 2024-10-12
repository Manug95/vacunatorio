import pc from "picocolors";
import { NoAffectedRowsError, DataOutOfRangeError } from "./src/modelos/Errores/errores.js";

const FKmap = new Map([
  ["provinciaId", "Provincia"],
  ["paisId", "País"],
  ["laboratorioId", "Laboratorio"],
  ["tipoVacunaId", "Tipo de Vacuna"],
  ["vacunaId", "Vacuna"],
  ["depositoId", "Deposito Nacional"],
  ["descarteId", "Descarte"],
  ["loteId", "Lote"],
  ["subloteId", "Sublote"],
  ["miniloteId", "Minilote"],
  ["localidadId", "Localidad"],
  ["centroId", "Centro de Vacunación"],
  ["redistribuidoPor", "Centro de Vacunación Origen"],
  ["personalId", "Personal"],
  ["enfermeroId", "Enfermero/a"],
  ["pacienteId", "Paciente"],
]);

export default class Utils {
  static formatearAfechaArgentina(fecha) {
    return fecha.toISOString().split("T")[0].split("-").reverse().join("-");
  }

  static crearNroLote(segundos) {
    return "L" + crearFechaDeLotes(segundos);
  }
}

export function capturarErroresDeSequelize(error) {
  if (!error) return;
  if (!error.name) return;

  if (error instanceof NoAffectedRowsError) {
    console.log(pc.red(error.message));
    throw new Error("No se pudo completar la operación");
  }

  if (error.name === "SequelizeDatabaseError" && error.parent.code === "ER_DATA_OUT_OF_RANGE") {
    throw new DataOutOfRangeError("");
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    let mensaje = `El valor "${error.errors[0].value}" del campo "${error.errors[0].path}" ya existe`;
    throw new Error(mensaje);
  }
  
  if (error.name === "SequelizeValidationError") {
    let mensaje = "Error: " + error.errors.map(e => e.message).join(", ");
    throw new Error(mensaje);
  }

  if (error.name === "SequelizeForeignKeyConstraintError" && error.parent.code === "ER_NO_REFERENCED_ROW_2") {
    console.log(pc.red("Error al insertar clave(s) foranea(s): " + error.fields.join(", ")));
    let mensaje = `\'${error.fields.map(field => FKmap.get(field)).join(" o ")}\' incorrecto(s)`;
    throw new Error(mensaje);
  }
}

export function validarCantidad(cantidad) {
  if (cantidad === undefined) {
    throw new Error("Es necesario especificar la cantidad de vacunas");
  }
  
  const c = Number(cantidad);

  if (Number.isNaN(c)) {
    throw new Error("Cantidad de vacunas invalida");
  }

  if (!Number.isInteger(c)) {
    throw new Error("La cantidad de vacunas recibida no es un numero entero");
  }

  if (c === 0) {
    throw new Error("La cantidad no puede ser 0");
  }

  if (c < 0) {
    throw new Error("La cantidad no puede ser negativa");
  }
}

function crearFechaDeLotes(segundos) {
  let fecha = new Date();

  if (segundos) {
    const ms = fecha.getTime() + (segundos * 1000);
    fecha = new Date(ms);
  }
  
  return fecha.toISOString().replace("T", "/").split(".")[0];
}