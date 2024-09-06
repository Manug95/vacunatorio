import { sequelize } from "../../sequelize.js";
import loteServicio from "../servicios/loteServicio.js";
import almacenaServicio from "../servicios/almacenaServicio.js";

export default class LoteControlador {
  static async crear(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };

    const transaction = await sequelize.transaction();
    try {
      const body = req.body;
      
      const nuevoLote = await loteServicio.crearLote(body, transaction);
      await almacenaServicio.almacenarLote({ lote: nuevoLote.id, deposito: body.deposito }, transaction);

      await transaction.commit();
    }
    catch (error) {
      console.error(error);
      
      statusCode = 400;
      respuesta.ok = false;
      respuesta.mensaje = error.message;

      await transaction.rollback();
    }
    finally {
      res.status(statusCode).json(respuesta);
    }

    return;
  }
}