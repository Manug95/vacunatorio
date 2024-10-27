import { Personal } from "../modelos/relaciones.js";
import { Op } from "sequelize";
import pc from "picocolors";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class PersonalServicio {

	constructor() {
		if (instanciaServicio) {
			throw new Error("Solo se puede crear una instancia!");
		}
		instanciaServicio = this;
	}

	async crearPersonal({ nombres, apellidos, cargo, transaction }) {
		const codigo = await this.#crearCodigo();

		const nuevoPersonal = { // activo tiene por defecto en true
			nombres,
			apellidos,
			cargo,
			codigo
		};

		try {

			if (transaction) {
				return await Personal.create(nuevoPersonal, { transaction: transaction });
			} else {
				return await Personal.create(nuevoPersonal);
			}

		} catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
		}
	}

	async actualizarPersonal({ id, nombres, apellidos, cargo, codigo, activo, transaction }) {
		if (!id) throw new Error("Falta la id del personal");

    const personalActualizado = {};

    if (nombres) personalActualizado.nombres = nombres;
    if (apellidos) personalActualizado.apellidos = apellidos;
    if (cargo) personalActualizado.cargo = cargo;
    if (codigo) personalActualizado.codigo = codigo;
    if (activo) personalActualizado.activo = activo;

    if (transaction) {
      return Personal.update(personalActualizado, { where: { id }, transaction });
    } else {
      return Personal.update(personalActualizado, { where: { id } });
    }
	}

	async listarPersonal({ cargo, activo }) {
		return Personal.findAll({ where: { activo: { [Op.eq]: true } } });
	}

	async traerPersonalPorCodigo({ codigo, transaction }) {
		if (transaction) {
			return Personal.findOne({ where: { codigo }, transaction });
		} else {
			return Personal.findOne({ where: { codigo } });
		}
	}

	async getEnfermeros({ transaction }) {
		if (transaction) {
			return Personal.findAll({ where: { cargo: "ENFERMERO" }, transaction });
		} else {
			return Personal.findAll({ where: { cargo: "ENFERMERO" } });
		}
	}

	async #crearCodigo() {
		let codigo;

		try {
			codigo = await Personal.max("codigo");

			codigo = Number(codigo.split("-")[1]);
			codigo++;
			codigo = codigo + "";

			while(codigo.length < 4) {
				codigo = "0" + codigo;
			}

			codigo = "C-" + codigo;
		} catch (error) {
			console.log(pc.red("Error al crear el codigo del personal"));
			codigo = null;
		}

		return codigo;
	}

}

const personalServicio = Object.freeze(new PersonalServicio());

export default personalServicio;