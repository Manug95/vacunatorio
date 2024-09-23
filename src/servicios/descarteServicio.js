import { Descarte } from "../modelos/relaciones.js";

let instanciaServicio;

class DescarteServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearDescarte({ fecha, motivo, formaDescarte, transaction }) {
    const descarte = { //fecha tiene por defecto la fecha actual
      motivo,
      formaDescarte
    };

    if (fecha) descarte.fecha = fecha;

    if (transaction) {
      return Descarte.create(descarte, { transaction: transaction });
    } else {
      return Descarte.create(descarte);
    }
  }
}

const descarteServicio = Object.freeze(new DescarteServicio());

export default descarteServicio;