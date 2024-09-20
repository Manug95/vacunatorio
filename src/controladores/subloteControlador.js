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
}