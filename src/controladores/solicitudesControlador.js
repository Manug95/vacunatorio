import solicitudesServicio from "../servicios/solicitudServicio.js";
import provinciaServicio from "../servicios/provinciaServicio.js";
import vacunaServicio from "../servicios/vacunaServicio.js";
import centroVacunacionServicio from "../servicios/centroVacunacionServicio.js";
import { cantResultsPorPaginacion } from "../../utils.js";
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

  static async crearSolicitudMinilote(req, res) {
    let statusCode = 201;
    const respuesta = { ok: true };

    try {
      await solicitudesServicio.crearSolicitudMinilote(req.body);
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
    }
    finally {
      res.status(status).json(respuesta);
    }

  }

  static async listarSolicitudesMinilote(req, res) {
    // const { deposito_id } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      const { solicitudes, cantidadSolicitudes } = await solicitudesServicio.listarSolicitudesMinilote(req.query);

      const limit = req.query.limit ?? 10;
      respuesta.paginadores = Math.floor(cantidadSolicitudes / limit + 1) ?? 1;
      respuesta.solicitudes = solicitudes;
      
    }
    catch (error) {
      respuesta.error = true;
      status = 400;
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
        activeLink: { "solSublote": "active-link" },
        provincias: resultadosConsultas.provincias ?? [],
        vacunas: resultadosConsultas.vacunas ?? [],
        tabTitle: "solicitar sublote",
        isLogged: req.userData.isLogged,
        rol: req.userData.rol
      }));
    }

  }

  static async vistaFormularioSolicitarMinilote (req, res) {
    const resultadosConsultas = {};

    try {
      const [ centros, vacunas ] = await Promise.all([
        centroVacunacionServicio.getCentrosDeVacunaciones(),
        vacunaServicio.getTiposDeVacunas()
      ]);

      resultadosConsultas.centros = centros;
      resultadosConsultas.vacunas = vacunas;
      
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/solicitarMinilote.pug", {
        activeLink: { "solMinilote": "active-link" },
        centros: resultadosConsultas.centros ?? [],
        vacunas: resultadosConsultas.vacunas ?? [],
        tabTitle: "solicitar minilote",
        isLogged: req.userData.isLogged,
        rol: req.userData.rol
      }));
    }

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
        activeLink: { "listado": "active-link" },
        solicitudes: resultadosConsultas.solicitudes,
        paginadores: Math.floor(resultadosConsultas.cantidadSolicitudes / 10 + 1) ?? 1,
        cantResultsPorPaginacion,
        cantResultsSelected: "10",
        error: resultadosConsultas.error,
        tabTitle: "listado solicitudes sublotes",
        isLogged: req.userData.isLogged,
        rol: req.userData.rol
      }));
    }

  }

  static async vistaListadoSolicitarMinilote(req, res) {
    const resultadosConsultas = {
      solicitudes: [],
      cantidadSolicitudes: 1,
      error: false
    };

    try {
      const solicitudes = await solicitudesServicio.listarSolicitudesMinilote(req.query);
      Object.assign(resultadosConsultas, solicitudes);
    }
    catch (error) {
      resultadosConsultas.error = true;
      console.log(error.message);
    } finally {
      res.send(pug.renderFile("src/vistas/listados/listadoSolicitudesMinilote.pug", {
        activeLink: { "listado": "active-link" },
        solicitudes: resultadosConsultas.solicitudes,
        paginadores: Math.floor(resultadosConsultas.cantidadSolicitudes / 10 + 1) ?? 1,
        cantResultsPorPaginacion,
        cantResultsSelected: "10",
        error: resultadosConsultas.error,
        tabTitle: "listado solicitudes minilotes",
        isLogged: req.userData.isLogged,
        rol: req.userData.rol
      }));
    }

  }

}