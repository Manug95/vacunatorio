import loteServicio from "../servicios/loteServicio.js";
import descarteServicio from "../servicios/descarteServicio.js";

export default class LoteControlador {
  static async crear(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };
    const { vacuna, cantidad, deposito } = req.body;

    try {
      await loteServicio.crearLote({ cantidad, vacuna, deposito });
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

  static async descartar(req, res) {
    let statusCode = 200;
    const respuesta = { ok: true };
    const { lote, fecha, motivo, formaDescarte } = req.body;

    try {
      await loteServicio.descartarLote({ loteId: lote, fecha, motivo, formaDescarte });
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