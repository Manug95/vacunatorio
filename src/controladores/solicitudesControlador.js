import solicitudesServicio from "../servicios/solicitudServicio.js";
import provinciaServicio from "../servicios/provinciaServicio.js";
import vacunaServicio from "../servicios/vacunaServicio.js"
import pug from "pug";

export default class SolicitudesControlador {
  static async crearSolicitudSublote(req, res){
    let statusCode = 201;
    const respuesta = { ok: true };

    try {
      await solicitudesServicio.crearSolicitudSublote(req.body);
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

  static async listarSolicitudesSublote(req, res) {
    // const { deposito_id } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      const { solicitudes, cantidadSolicitudes } = await solicitudesServicio.listarSolicitudesSublote(req.query);

      const limit = req.query.limit ?? 10;
      respuesta.paginadores = Math.floor(cantidadSolicitudes / limit + 1) ?? 1;
      respuesta.solicitudes = solicitudes;
      
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

  static async vistaFormularioSolicitarSublote (req, res) {
    const resultadosConsultas = {};

    try {
      const [ provincias, vacunas ] = await Promise.all([
        provinciaServicio.getProvincias(),
        vacunaServicio.getTiposDeVacunas()
      ]);

      resultadosConsultas.provincias = provincias;
      resultadosConsultas.vacunas = vacunas;
      
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/solicitarSubLote.pug", {
        pretty: true,
        activeLink: "sol-nac",
        provincias: resultadosConsultas.provincias ?? [],
        vacunas: resultadosConsultas.vacunas ?? []
      }));
    }

    return;

  }

  static async vistaListadoSolicitarSublote(req, res) {
    const resultadosConsultas = {
      solicitudes: [],
      cantidadSolicitudes: 1,
      error: false
    };

    try {
      const solicitudes = await solicitudesServicio.listarSolicitudesSublote(req.query);
      Object.assign(resultadosConsultas, solicitudes);
    }
    catch (error) {
      resultadosConsultas.error = true;
      console.log(error.message);
    } finally {
      res.send(pug.renderFile("src/vistas/listados/listadoSolicitudesSublote.pug", {
        pretty: true,
        activeLink: "listado-sol",
        solicitudes: resultadosConsultas.solicitudes,
        paginadores: Math.floor(resultadosConsultas.cantidadSolicitudes / 10 + 1) ?? 1,
        error: resultadosConsultas.error
      }));
    }

  }

}