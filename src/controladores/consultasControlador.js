import pug from "pug";
import consultasServicio from "../servicios/consultasServicio.js";

const CONSULTAS = {
  cslt1: consultasServicio.cantVacunasPorLaboratorioPorFecha
};

export default class ConsultasControlador {
  static async antenderConsulta(req, res) {
    const { consulta } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      
      respuesta.body = await CONSULTAS[consulta](req.query);
      
    }
    catch (error) {
      respuesta.error = true;
      status = 400;
      console.log(error.message);
    }
    finally {
      res.status(status).json(respuesta);
    }
    
  }

  static async vistaCantVacunasPorLaboratorioPorFecha(req, res) {
    let vista;

    try {
      vista = pug.renderFile("src/vistas/vistaCantVacunasPorLaboratorioPorFecha.pug", {
        pretty: true,
        activeLink: "consultas"
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