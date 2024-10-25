import { Paciente } from "../modelos/relaciones.js";
import { Op } from "sequelize";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class PacienteServicio {

	constructor() {
		if (instanciaServicio) {
			throw new Error("Solo se puede crear una instancia!");
		}
		instanciaServicio = this;
	}

	async crearPaciente({ dni, nombres, apellidos, email, telefono, fechaNac, genero, localidad, transaction }) {
		const nuevoPaciente = {
			dni,
			nombres,
			apellidos,
			email,
			telefono,
			fechaNac,
			genero,
			localidadId: localidad
		};

		try {

			if (transaction) {
				return await Paciente.create(nuevoPaciente, { transaction: transaction });
			} else {
				return await Paciente.create(nuevoPaciente);
			}

		} catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
		}
	}

	async actualizarPersonal({ id, dni, nombres, apellidos, email, telefono, fechaNac, genero, transaction }) {
		if (!id) throw new Error("Falta la id del paciente");

		const pacienteActualizado = {};

		if (nombres) pacienteActualizado.nombres = nombres;
		if (apellidos) pacienteActualizado.apellidos = apellidos;
		if (dni) pacienteActualizado.dni = dni;
		if (email) pacienteActualizado.email = email;
		if (telefono) pacienteActualizado.telefono = telefono;
		if (fechaNac) pacienteActualizado.fechaNac = fechaNac;
		if (genero) pacienteActualizado.genero = genero;

		if (transaction) {
			return Paciente.update(pacienteActualizado, { where: { id }, transaction });
		} else {
			return Paciente.update(pacienteActualizado, { where: { id } });
		}
	}

	async buscarPacientePorDNI( dni ) {
		return Paciente.findOne({ where: { dni: { [Op.eq]: dni } } });
	}

	async buscarPacientePorID( id ) {
		return Paciente.findByPk(id);
	}

}

const pacienteServicio = Object.freeze(new PacienteServicio());

export default pacienteServicio;