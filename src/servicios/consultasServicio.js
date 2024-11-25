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

  async cslt1({ fechaInicio, fechaFin }) { // ESTA MAL
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

      const columnas = ["LABORATORIO", "CANTIDAD VACUNAS", "FECHA DE COMPRA"];

      return { results, columnas };

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
      
      const columnas = ["TIPO VACUNA", "EN NACIÓN", "EN PROVINCIA", "EN CENTROS", "DESCARTADAS", "VENCIDAD", "APLICADAS"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

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
                     GROUP BY provincia, tipo_vacuna;`
      ;

      const results = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["PROVINCIA", "TIPO VACUNA", "STOCK"];

      return { results, columnas };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt4() {
    try {
      const query = `SELECT prov.nombre AS provincia, centro, tipo_vacuna, paciente
                     FROM (
                       SELECT sl.provinciaId AS provincia, cv.nombre AS centro, tp.tipo AS tipo_vacuna, CONCAT(p.nombres, " - ", p.dni) AS paciente
                         FROM vacunaciones AS vacs
                         INNER JOIN pacientes AS p ON vacs.pacienteId = p.id
                         INNER JOIN centros_vacunacion AS cv ON vacs.centroId = cv.id
                         INNER JOIN minilotes AS ml ON vacs.miniloteId = ml.id
                         INNER JOIN sublotes AS sl ON ml.subloteId = sl.id
                         INNER JOIN lotes AS l ON sl.loteId = l.id
                         INNER JOIN vacunas AS v ON l.vacunaId = v.id
                         INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                         WHERE l.vencimiento < vacs.fecha
                     ) AS cslt
                     INNER JOIN provincias AS prov ON cslt.provincia = prov.id
                     GROUP BY provincia, centro, tipo_vacuna;`
      ;

      const results = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["PROVINCIA", "CENTRO VACUNACIÓN", "TIPO VACUNA", "PACIENTE"];

      return { results, columnas };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt5() {
    try {
      const query = `SELECT consult.lote_proveedor AS lote_proveedor
                        , consult.lote_cant AS lote_cant
                        , IFNULL(consult.provincia, "NO HAY") AS provincia
                        , SUM(IFNULL(consult.sublote_cant, 0)) AS sublote_cant
                        , IFNULL(consult.centro, "NO HAY") AS centro
                        , SUM(IFNULL(consult.centros_cant, 0)) AS centros_cant
                    FROM (
                      SELECT l.nroLote AS lote_proveedor
                            , l.cantidad AS lote_cant
                            , sl.provinciaId AS provincia
                            , sl.cantidad AS sublote_cant
                            , cv.nombre AS centro
                            , dp.cantidad AS centros_cant
                        FROM  centros_vacunacion AS cv
                        RIGHT JOIN distribuciones_provinciales AS dp ON dp.centroId = cv.id -- AND dp.descarteId IS NULL
                        RIGHT JOIN minilotes AS ml ON dp.miniloteId = ml.id
                        RIGHT JOIN sublotes AS sl ON ml.subloteId = sl.id --  sl.descarteId IS NULL
                        RIGHT JOIN lotes AS l ON sl.loteId = l.id --  l.descarteId IS NULL
                        WHERE l.vencimiento < CURRENT_DATE
                            AND l.descarteId IS NULL
                            AND sl.descarteId IS NULL
                            AND dp.descarteId IS NULL
                    ) AS consult
                    GROUP BY lote_proveedor, provincia, centro;`
      ;

      const results = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["LOTE-PROVEEDOR", "CANT. EN LOTE", "PROVINCIA", "CANT. EN PROVINCIA", "CENTRO", "CANT. EN CENTRO"];

      return { results, columnas };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt6() {
    try {
      const query = `SELECT tp.tipo AS tipo_vacuna, p.nombre AS provincia, locs.nombre AS localidad, COUNT(pacienteId) AS cantidad_pacietnes
                    FROM vacunaciones AS vacs
                    INNER JOIN pacientes AS pac ON vacs.pacienteId = pac.id
                    INNER JOIN localidades AS locs ON pac.localidadId = locs.id
                    INNER JOIN provincias AS p ON locs.provinciaId = p.id
                    INNER JOIN minilotes AS ml ON vacs.miniloteId = ml.id
                    INNER JOIN sublotes AS sl on ml.subloteId = sl.id
                    INNER JOIN lotes AS l ON sl.loteId = l.id
                    INNER JOIN vacunas AS v ON l.vacunaId = v.id
                    INNER JOIN tipos_vacunas AS tp on v.tipoVacunaId = tp.id
                    GROUP BY tipo_vacuna, provincia, localidad;`
      ;

      const results = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["TIPO VACUNA", "PROVINCIA", "LOCALIDAD", "CANTIDAD PACIENTES"];

      return { results, columnas };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }
}

const consultasServicio = Object.freeze(new ConsultasServicio());
// console.log(await consultasServicio.cslt5());

export default consultasServicio;