import { Vacunacion } from "../modelos/relaciones.js";
import { sequelize } from "../../sequelize.js";
import { Op } from "sequelize";
import { capturarErroresDeSequelize } from "../../utils.js";
import distribucionProvincialServicio from "./distribucionProvincialServicio.js";
import { NoAffectedRowsError } from "../modelos/Errores/errores.js";

let instanciaServicio;

class VacunacionServicio {

	constructor() {
		if (instanciaServicio) {
			throw new Error("Solo se puede crear una instancia!");
		}
		instanciaServicio = this;
	}

	async crearVacunacion({ fecha, pacienteId, centroId, personalId, miniloteId }) {
		const nuevaVacunacion = { // la fecha tiene por defecto la fecha actual
			pacienteId,
			enfermeroId: personalId,
			centroId,
			miniloteId
		};

		if (fecha) nuevaVacunacion.fecha = fecha;

		const transaction = await sequelize.transaction();
		try {
			const distribucion = await distribucionProvincialServicio.buscarDistribucionPorMiniloteYCentro({ miniloteId, centroId });

			if (!distribucion) throw new Error("No hay vacunas");

			const values = await Promise.all([
				Vacunacion.create(nuevaVacunacion, { transaction: transaction }),
				distribucionProvincialServicio.actualizarCantidadVacunas({ id: distribucion.id, cantidadADecrementar: 1, transaction })
			]);

			// compruebo que se haya realizado la actualizacion de la cantidad de vacunas
      if (values[1][0][1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas de la distribución");

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			capturarErroresDeSequelize(error);
			if (error.message === "No hay vacunas") throw new Error(error.message);
			throw new Error("Hubo un problema al realizar la operación");
		}
	}

	async actualizarVacunacion({ id, nombres, apellidos, cargo, codigo, activo, transaction }) {
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

}

const vacunacionServicio = Object.freeze(new VacunacionServicio());

export default vacunacionServicio;