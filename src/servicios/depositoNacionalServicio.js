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

  async #traerDepositos(transaction) {
    try {
      if (transaction) {
        this.#depositos = await DepositoNacional.findAll({ transaction: transaction });
      } else {
        this.#depositos = await DepositoNacional.findAll();
      }
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer los depositos nacionales");
    }
  }
}

const depositoNacionalServicio = Object.freeze(new DepositoNacionalServicio());

export default depositoNacionalServicio;