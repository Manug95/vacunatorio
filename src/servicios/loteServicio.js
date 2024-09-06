import { Lote } from "../modelos/relaciones.js";
import { faker } from '@faker-js/faker';
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class LoteServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearLote({ vacuna, cantidad }, transaction) {
    if (!vacuna) {
      throw new Error("Es necesario especificar de que vacunas es el nuevo lote");
    }
    
    const nroLote = this.#crearNroLote();
    const vencimiento = faker.date.future();
    const fechaFabricacion = faker.date.recent();

    const lote = {
      nroLote,
      vencimiento,
      fechaFabricacion,
      vacunaId: vacuna,
      cantidad
    };

    try {

      if (transaction) {
        return await Lote.create(lote, { transaction: transaction });
      } else {
        return await Lote.create(lote);
      }

    } catch (error) {
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al crear el lote");
    }
  }

  #crearFechaDeLotes(segundos) {
    let fecha = new Date();
  
    if (segundos) {
      const ms = fecha.getTime() + (segundos * 1000);
      fecha = new Date(ms);
    }
    
    return fecha.toISOString().replace("T", "/").split(".")[0];
  }

  #crearNroLote(segundos) {
    return "L" + this.#crearFechaDeLotes(segundos);
  }
}

const loteServicio = Object.freeze(new LoteServicio());

export default loteServicio;