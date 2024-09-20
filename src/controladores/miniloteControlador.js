import { sequelize } from "../../sequelize.js";
import miniLoteServicio from "../servicios/miniloteServicio.js";
import distribucionProvincialServicio from "../servicios/distribucionProvincialServicio.js";

export default class MiniLoteControlador {
  static async distribuir(req, res) {
    let status = 201;
    const respuesta = { ok: true };
    const { sublote, cantidad, centro } = req.body;

    try {
      await distribucionProvincialServicio.distribuirMiniLote({ subloteId: sublote, cantidad, centroId: centro });
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

  static async redistribuir(req, res) {
    let status = 201;
    const respuesta = { ok: true };
    const { distribucion, minilote, cantidad, centroOrigen, centroDestino } = req.body;

    try {
      await distribucionProvincialServicio.redistribuirMiniLote({ miniloteId: minilote, cantidad, centroOrigen, centroDestino, distribucionId: distribucion });
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