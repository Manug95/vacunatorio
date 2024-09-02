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

function crearFechaDeLotes(segundos) {
  let fecha = new Date();

  if (segundos) {
    const ms = fecha.getTime() + (segundos * 1000);
    fecha = new Date(ms);
  }
  
  return fecha.toISOString().replace("T", "/").split(".")[0];
}