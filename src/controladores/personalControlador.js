import personalServicio from "../servicios/personalServicio.js";

export default class PersonalControlador {
  static async crear(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };
    const { nombres, apellidos, cargo } = req.body;

    try {
      await personalServicio.crearPersonal({ nombres, apellidos, cargo });
    }
    catch (error) {
      
      statusCode = 400;
      respuesta.ok = false;
      respuesta.mensaje = error.message;

    }
    finally {
      res.status(statusCode).json(respuesta);
    }
  }
}