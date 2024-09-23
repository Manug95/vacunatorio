export default class Utils {
  static formatearAfechaArgentina(fecha) {
    return fecha.toISOString().split("T")[0].split("-").reverse().join("-");
  }

  static crearNroLote(segundos) {
    return "L" + crearFechaDeLotes(segundos);
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

export function esForeignKeyError(error) {
  return error.name === "SequelizeForeignKeyConstraintError" && error.parent.code === "ER_NO_REFERENCED_ROW_2";
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