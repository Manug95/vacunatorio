// import { sequelize } from "../../sequelize.js";
import loteServicio from "../servicios/loteServicio.js";
// import almacenaServicio from "../servicios/almacenaServicio.js";

export default class LoteControlador {
  static async crear(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };

    // const transaction = await sequelize.transaction();
    try {
      const { vacuna, cantidad, deposito } = req.body;

      if (!vacuna) {
        throw new Error("Es necesario especificar el tipo de vacuna que se quiere");
      }
  
      if (!deposito) {
        throw new Error("Es necesario especificar el deposito en el que se quiere almacenar el lote");
      }
  
      if (!cantidad) {
        throw new Error("Es necesario especificar la cantidad de vacunas que tendrá el lote");
      }
      
      const nuevoLote = await loteServicio.crearLote({ cantidad, vacuna, deposito });
      // const nuevoLote = await loteServicio.crearLote({ cantidad, vacuna, deposito, transaction });
      // await almacenaServicio.almacenarLote({ lote: nuevoLote.id, deposito, transaction });

      // await transaction.commit();
    }
    catch (error) {
      
      statusCode = 400;
      respuesta.ok = false;
      respuesta.mensaje = error.message;

      // await transaction.rollback();
    }
    finally {
      res.status(statusCode).json(respuesta);
    }

    return;
  }
}