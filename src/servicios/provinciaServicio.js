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

  async findProvincias(transaction) {
    if (transaction) {
      return await Provincia.findAll({ transaction: transaction });
    } else {
      return await Provincia.findAll();
    }
  }

  async #traerProvincias(transaction) {
    let datos;

    try {
      datos = await this.findProvincias(transaction);
      this.#provincias = datos.map(d => d.toJSON());
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer las provincias");
    }
  }
}

const provinciaServicio = Object.freeze(new ProvinciaServicio());

export default provinciaServicio;