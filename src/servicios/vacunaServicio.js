import { Vacuna, TipoVacuna, Laboratorio } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class VacunaServicio {

  #vacunas;
  #tiposVacunas;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;

    // this.#tiposVacunas = [];
    // this.#vacunas = [];
  }

  /**
   * @param {*} transaction 
   * @returns {Promise<Vacuna[]>}
   */
  async getVacunas(transaction) {
    if (!this.#vacunas) {
      await this.#traerVacunas(transaction);
    }
      
    return this.#vacunas;
  }

  async getTiposDeVacunas(transaction) {
    if (!this.#tiposVacunas) {
      await this.#traerTiposDeVacunas(transaction);
    }

    return this.#tiposVacunas;
  }

  async #traerVacunas(transaction) {
    const includeOpt = [
      {
        model: TipoVacuna,
        required: true
      }, 
      { 
        model: Laboratorio, 
        attributes: ["id", "nombre"],
        required: true
      }
    ];

    try {
      if (transaction) {
        this.#vacunas = await Vacuna.findAll({
          include: includeOpt,
          order: [[TipoVacuna, "tipo", "ASC"]],
          transaction
        });
      } else {
        this.#vacunas = await Vacuna.findAll({
          include: includeOpt,
          order: [[TipoVacuna, "tipo", "ASC"]]
        });
      }
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer las vacunas");
    }
  }

  async #traerTiposDeVacunas(transaction) {
    try {
      if (transaction) {
        this.#tiposVacunas = await Vacuna.findAll({
          group: "tipo",
          order: [[TipoVacuna, 'tipo', 'ASC']],
          include: [ { model: TipoVacuna, required: true } ],
          transaction
        });
      } else {
        this.#tiposVacunas = await Vacuna.findAll({
          group: "tipo",
          order: [[TipoVacuna, 'tipo', 'ASC']],
          include: [ { model: TipoVacuna, required: true } ]
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

}

const vacunaServicio = Object.freeze(new VacunaServicio());

export default vacunaServicio;