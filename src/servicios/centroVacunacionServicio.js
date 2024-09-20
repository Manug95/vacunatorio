import { CentroVacunacion } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class CentroVacunacionServicio {

  #centros;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  /**
   * @param {*} transaction 
   * @returns {Promise<CentroVacunacion[]>}
   */
  async getCentrosDeVacunaciones(transaction) {
    if (!this.#centros) {
      await this.#traerCentros(transaction);
    }
      
    return this.#centros;
  }

  async #traerCentros(transaction) {
    try {
      if (transaction) {
        this.#centros = await CentroVacunacion.findAll({ transaction: transaction });
      } else {
        this.#centros = await CentroVacunacion.findAll();
      }
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer los centros de vacunacion");
    }
  }
}

const centroVacunacionServicio = Object.freeze(new CentroVacunacionServicio());

export default centroVacunacionServicio;