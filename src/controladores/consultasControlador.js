import pug from "pug";
import consultasServicio from "../servicios/consultasServicio.js";

const CONSULTAS = {
  cslt1: consultasServicio.cslt1,
  cslt2: consultasServicio.cslt2,
  cslt3: consultasServicio.cslt3,
  cslt4: consultasServicio.cslt4,
  cslt5: consultasServicio.cslt5,
  cslt6: consultasServicio.cslt6
};

const consultasValidas = ["cslt1", "cslt2", "cslt3", "cslt4", "cslt5", "cslt6"];

export default class ConsultasControlador {
  static async antenderConsulta(req, res) {
    const { consulta } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      if (!consultasValidas.some(c => c === consulta)) throw new Error("Consulta incorrecta");

      const { results, columnas } = await CONSULTAS[consulta](req.query);
      
      respuesta.registros = results;
      respuesta.columnas = columnas;
      
    }
    catch (error) {
      respuesta.error = true;
      respuesta.mensaje = error.message;
      status = 400;
    }
    finally {
      res.status(status).json(respuesta);
    }
    
  }

  static async vistaConsultas(req, res) {
    let vista;

    try {
      vista = pug.renderFile("src/vistas/listados/consultas.pug", {
        activeLink: { "consultas": "active-link" },
        tabTitle: "consultas",
        isLogged: req.userData.isLogged,
        rol: req.userData.rol
      });
    }
    catch (error) {
      console.log(error.message);
    }
    finally {
      res.send(vista ?? "<h1>Error</h1>");
    }
  }

}