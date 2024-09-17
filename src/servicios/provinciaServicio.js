import { Provincia } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class ProvinciaServicio {

  #provincias;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

    /**
   * @param {*} transaction 
   * @returns {Promise<Provincia[]>}
   */
  async getProvincias(transaction) {
    if (!this.#provincias) {
      await this.#traerProvincias(transaction);
    }
      
    return this.#provincias;
  }

  async #traerProvincias(transaction) {
    try {
      if (transaction) {
        this.#provincias = await Provincia.findAll({ transaction: transaction });
      } else {
        this.#provincias = await Provincia.findAll();
      }
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer las provincias");
    }
  }
}

const provinciaServicio = Object.freeze(new ProvinciaServicio());

export default provinciaServicio;