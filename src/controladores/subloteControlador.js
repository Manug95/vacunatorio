import { sequelize } from "../../sequelize.js";
import subLoteServicio from "../servicios/subloteServicio.js";

export default class SubLoteControlador {
  static async crear(req, res) {
    let status = 201;
    const respuesta = { ok: true };
    const { lote, provincia, cantidad } = req.body;

    try {
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

  static async descartar(req, res) {
    let statusCode = 200;
    const respuesta = { ok: true };
    const { sublote, fecha, motivo, formaDescarte } = req.body;

    try {
      await subLoteServicio.descartarSubLote({ subloteId: sublote, fecha, motivo, formaDescarte });
    }
    catch (error) {
      
      statusCode = 400;
      respuesta.ok = false;
      respuesta.mensaje = error.message;

    }
    finally {
      res.status(statusCode).json(respuesta);
    }

    return;
  }
}