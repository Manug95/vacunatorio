import { Localidad } from "../modelos/relaciones.js";
import { Op } from "sequelize";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class LocalidadServicio {

  #localidades;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearLocalidad({ nombre, provinciaId, transaction }) {
    try {

			if (transaction) {
        return await Localidad.create({ nombre, provinciaId }, { transaction });
      } else {
        return await Localidad.create({ nombre, provinciaId });
      }

		} catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
		}
  }

    /**
   * @param {*} transaction 
   * @returns {Promise<Provincia[]>}
   */
  async getLocalidades(transaction) {
    if (!this.#localidades) {
      await this.#traerLocalidades(transaction);
    }
      
    return this.#localidades;
  }

  async getProvinciaPorNombre({ nombre, transaction }) {
    if (!this.#localidades) {
      await this.#traerLocalidades(transaction);
    }

    return this.#localidades.find(p => p.nombre === nombre);
  }

  async getLocalidadPorID({ id, transaction }) {
    if (!this.#localidades) {
      await this.#traerLocalidades(transaction);
    }

    return this.#localidades.find(p => p.id == id);
  }

  async getLocalidadPorNombreYProvincia({ localidad, provinciaId, transaction }) {
    return Localidad.findOne({
      where: {
        [Op.and]: [
          { nombre: { [Op.like]: `%${localidad}%` } },
          { provinciaId }
        ]
      }
    });
  }

  async findLocalidades(transaction) {
    if (transaction) {
      return await Localidad.findAll({ transaction: transaction, order: [["nombre", "ASC"]] });
    } else {
      return await Localidad.findAll({ order: [["nombre", "ASC"]] });
    }
  }

  async #traerLocalidades(transaction) {
    let datos;

    try {
      datos = await this.findLocalidades(transaction);
      this.#localidades = datos.map(d => d.toJSON());
    } catch (error) {
      console.log(error);
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al traer las localidades");
    }
  }
}

const localidadServicio = Object.freeze(new LocalidadServicio());

export default localidadServicio;