import loteServicio from "../servicios/loteServicio.js";

export default class LoteControlador {
  static async crear(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };
    const { vacuna, cantidad, deposito } = req.body;

    try {
      const nuevoLote = await loteServicio.crearLote({ cantidad, vacuna, deposito });
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