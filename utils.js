export default class Utils {
  static afechaArgentina(fecha) {
    return fecha.toISOString().split("T")[0].split("-").reverse().join("-");
  }

  static crearNroLote(segundos) {
    return "L" + crearFechaDeLotes(segundos);
  }

  static crearNroSubLote() {
    return "SL" + crearFechaDeLotes();
  }

  static crearNroMiniLote() {
    return "ML" + crearFechaDeLotes();
  }
}

export function capturarErroresDeSequelize(error) {
  if (error.name === "SequelizeUniqueConstraintError") {
    throw new Error(`El valor "${error.errors[0].value}" del campo "${error.errors[0].path}" ya existe`);
  }
  
  if (error.name === "SequelizeValidationError") {
    let mensaje = "Error: " + error.errors.map(e => e.message).join(", ");
    throw new Error(mensaje);
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