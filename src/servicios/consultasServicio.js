import { sequelize } from "../../sequelize.js";
import { Op } from "sequelize";
import { capturarErroresDeSequelize } from "../../utils.js";
import { MissingParamError } from "../modelos/Errores/errores.js";

let instanciaServicio;

class ConsultasServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async cantVacunasPorLaboratorioPorFecha({ fechaInicio, fechaFin }) {
    try {
			if (!fechaInicio) throw new MissingParamError("Falta la fecha de inicio");
			if (!fechaFin) throw new MissingParamError("Falta la fecha de fin");

      const query = `SELECT labs.nombre AS laboratorio, COUNT(*) AS cantidad_vacunas, l.fechaCompra AS fecha_compra
                     FROM lotes AS l
                     INNER JOIN vacunas AS v ON l.vacunaId = v.id
                     INNER JOIN laboratorios AS labs ON labs.id = v.laboratorioId
                     GROUP BY laboratorio
                     HAVING fecha_compra BETWEEN ? AND ?
                     ORDER BY laboratorio ASC;`
      ;

      const [results, metadata] = await sequelize.query({ query, values: [fechaInicio, fechaFin] });

      return results;

		} catch (error) {
			capturarErroresDeSequelize(error);
      if (error instanceof MissingParamError) throw error;
			throw new Error("Hubo un problema al realizar la operación");
		}
  }
}

const consultasServicio = Object.freeze(new ConsultasServicio());

export default consultasServicio;