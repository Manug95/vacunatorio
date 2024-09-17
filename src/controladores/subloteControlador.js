import { sequelize } from "../../sequelize.js";
import subLoteServicio from "../servicios/subloteServicio.js";

export default class SubLoteControlador {
  static async crear(req, res) {
    let status = 201;
    const respuesta = { ok: true };

    try {
      const { lote, provincia, cantidad } = req.body;

      if (!lote) {
        throw new Error("Es necesario especificar el lote origen del sublote");
      }
  
      if (!provincia) {
        throw new Error("Es necesario especificar la provincia a la que se enviara el sublote");
      }
  
      if (!cantidad) {
        throw new Error("Es necesario especificar la cantidad de vacunas que se quieren");
      }

      await subLoteServicio.crearSubLote({ provincia, cantidad, lote });
    }
    catch (error) {
      
      status = 400;
      respuesta.ok = false;
      respuesta.mensaje = error.message;
    }
    finally {
      res.status(status).json(respuesta);
    }

    return;
  }
}