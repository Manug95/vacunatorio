import { sequelize } from "../../sequelize.js";
import { QueryTypes } from "sequelize";
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

      const query = `CALL PR_CSLT1(?, ?);`;

      const [results, metadata] = await sequelize.query({ query, values: [fechaInicio, fechaFin] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["LABORATORIO", "CANTIDAD VACUNAS"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

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
      const query = `CALL PR_CSLT3();`;

      const [results, metadata] = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["PROVINCIA", "TIPO VACUNA", "STOCK"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt4() {
    try {
      const query = `CALL PR_CSLT4();`;

      const [results, metadata] = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["PROVINCIA", "CENTRO VACUNACIÓN", "TIPO VACUNA", "PACIENTE"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt5() {
    try {
      const query = `CALL PR_CSLT5();`;

      const [results, metadata] = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["LOTE-PROVEEDOR", "CANT. EN LOTE", "PROVINCIA", "CANT. EN PROVINCIA", "CENTRO", "CANT. EN CENTRO"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async cslt6() {
    try {
      const query = `CALL PR_CSLT6();`;

      const [results, metadata] = await sequelize.query({ query, values: [] }, {
        type: QueryTypes.SELECT
      });

      const columnas = ["TIPO VACUNA", "PROVINCIA", "LOCALIDAD", "CANTIDAD PACIENTES"];

      return { 
        results: Object.keys(results).map(k => results[k]), 
        columnas 
      };

    } catch (error) {
			capturarErroresDeSequelize(error);
			throw new Error("Hubo un problema al realizar la operación");
    }
    
  }
}

const consultasServicio = Object.freeze(new ConsultasServicio());

export default consultasServicio;