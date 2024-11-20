import { Localidad } from "../modelos/relaciones.js";
import { sequelize } from "../../sequelize.js";
import { Op, QueryTypes } from "sequelize";
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

  async cslt1({ fechaInicio, fechaFin }) {
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

		} catch (error) {console.error(error);
			capturarErroresDeSequelize(error);
      if (error instanceof MissingParamError) throw error;
			throw new Error("Hubo un problema al realizar la operación");
		}
  }

  async cslt2() {
    try {
      const query = "CALL PR_CSLT2();";

      const [results, metadata] = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      return Object.keys(results).map(k => results[k]);

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt3() {
    try {
      const query = `SELECT p.nombre AS provincia, tp.tipo AS tipo_vacuna, SUM(sl.cantidad) AS stock
                     FROM sublotes AS sl
                     INNER JOIN provincias AS p ON sl.provinciaId = p.id
                     INNER JOIN lotes AS l ON sl.loteId = l.id
                     INNER JOIN vacunas AS v ON l.vacunaId = v.id
                     INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                     WHERE sl.descarteId IS NULL
                     GROUP BY provincia, tipo_vacuna;`;

      const results = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      return results;

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }
}

const consultasServicio = Object.freeze(new ConsultasServicio());
// console.log(await consultasServicio.cslt3());

export default consultasServicio;