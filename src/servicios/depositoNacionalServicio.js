import { DepositoNacional } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class DepositoNacionalServicio {

  #depositos;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  /**
   * @param {*} transaction 
   * @returns {Promise<DepositoNacional[]>}
   */
  async getDepositosNacionales(transaction) {
    if (!this.#depositos) {
      await this.#traerDepositos(transaction);
    }
      
    return this.#depositos;
  }

  async getDepositoNacionalPorID({ id, transaction }) {
    if (!id) throw new Error("Falta la id");
    
    if (!this.#depositos) {
      await this.#traerDepositos(transaction);
    }
    
    return this.#depositos.find(d => d.id === +id);
  }

  async findDepositos(transaction) {
    if (transaction) {
      return await DepositoNacional.findAll({ transaction: transaction });
    } else {
      return await DepositoNacional.findAll();
    }
  }

  async #traerDepositos(transaction) {
    let datos;

    try {
      datos = await this.findDepositos(transaction);
      this.#depositos = datos.map(d => d.toJSON());
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer los depositos nacionales");
    }
  }
}

const depositoNacionalServicio = Object.freeze(new DepositoNacionalServicio());

export default depositoNacionalServicio;