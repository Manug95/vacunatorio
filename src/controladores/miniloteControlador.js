import { sequelize } from "../../sequelize.js";
import pug from "pug";
import { cantResultsPorPaginacion, formasDescarte } from "../../utils.js";
import distribucionProvincialServicio from "../servicios/distribucionProvincialServicio.js";
import centroVacunacionServicio from "../servicios/centroVacunacionServicio.js";
import vacunaServicio from "../servicios/vacunaServicio.js";
import provinciaServicio from "../servicios/provinciaServicio.js";
import solicitudesServicio from "../servicios/solicitudServicio.js";
import personalServicio from "../servicios/personalServicio.js";
import { NoAffectedRowsError } from "../modelos/Errores/errores.js";

export default class MiniLoteControlador {
  static async distribuir(req, res) {
    let status = 201;
    const respuesta = { ok: true };
    // const { sublote, cantidad, centro } = req.body;
    const { tipoVacuna, provincia, cantidad, centro, solicitud } = req.body;

    const transaction = await sequelize.transaction();
    try {
      // await distribucionProvincialServicio.distribuirMiniLote({ subloteId: sublote, cantidad, centroId: centro });

      const { cantidadSublotes, cantidadVacRestantes } = await distribucionProvincialServicio.distribuirMiniLoteAutomatico({ tipoVacuna, provincia, cantidad, centro, transaction });
      const vacunasEnviadas = cantidad - cantidadVacRestantes;

      if (solicitud) {
        const updateResult = await solicitudesServicio.actualizarCantidadVacunasSolicitudMinilote(solicitud, vacunasEnviadas, transaction);

        // compruebo que se haya realizado la actualizacion de la solicitud de minilotes
        if (updateResult[1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas del sublote");
      }

      respuesta.mensaje = `Se crearon ${cantidadSublotes} sublote(s)<br>Total de vacunas enviadas: ${vacunasEnviadas}<br>Vacunas sin enviar: ${cantidadVacRestantes}`;

      await transaction.commit();
    }
    catch (error) {
      await transaction.rollback();
      console.log(error);
      
      status = 400;
      respuesta.ok = false;
      respuesta.mensaje = error instanceof NoAffectedRowsError ? "No se pudo completar la operación" : error.message;

    }
    finally {
      res.status(status).json(respuesta);
    }

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

  static async descartar(req, res) {
    let statusCode = 200;
    const respuesta = { ok: true };
    const { distribucion, fecha, motivo, formaDescarte, codigo } = req.body;
    const codigoCompleto = "C-" + codigo;

    try {
      const personal = await personalServicio.traerPersonalPorCodigo({ codigo: codigoCompleto });

      if (!personal) throw new Error("El código no existe");

      await distribucionProvincialServicio.descartarDistribucion({ id: distribucion, fecha, motivo, formaDescarte, personalId: personal.id });
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

  static async listarDistribuciones(req, res) {
    const { centroId } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      const [ distribucionesDelcentroSeleccionado, centroSeleccionado ] = await Promise.all([
        distribucionProvincialServicio.listarDistribucionesPorCentroVacunacion(centroId, req.query),
        centroVacunacionServicio.getCentroPorID({ id: centroId })
      ]);

      respuesta.centroSeleccionado = centroSeleccionado.nombre;
      respuesta.distribuciones = distribucionesDelcentroSeleccionado.distribuciones;

      const limit = req.query.limit ?? 10;
      respuesta.paginadores = Math.floor(distribucionesDelcentroSeleccionado.cantidadDistribuciones / limit + 1) ?? 1;
      
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

  static async vistaFormCrearMinilote(req, res) {
    const resultadosConsultas = {};
    const { sol, tipoVac, centro, cant } = req.query;

    try {
      const [ provincias, vacunas, centros ] = await Promise.all([
        provinciaServicio.getProvincias(),
        vacunaServicio.getTiposDeVacunas(),
        centroVacunacionServicio.getCentrosDeVacunaciones()
      ]);

      resultadosConsultas.provincias = provincias;
      resultadosConsultas.centros = centros;
      resultadosConsultas.vacunas = vacunas.map(v => v.toJSON());
      
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/crearMinilote.pug", {
        pretty: true,
        activeLink: "crear-mini",
        cant,
        centroSel: centro,
        tipoVac,
        centros: resultadosConsultas.centros,
        provincias: resultadosConsultas.provincias,
        sol,
        vacunas: resultadosConsultas.vacunas
      }));
    }
  }

  static async vistaListadoDistribuciones(req, res) {
    const datos = { error: false };

    try {
      datos.centros = await centroVacunacionServicio.getCentrosDeVacunaciones();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/listados/listadodeStock.pug", {
        pretty: true,
        activeLink: "listado-minilotes",
        centros: datos.centros,
        paginadores: 1,
        error: datos.error,
        cantResultsPorPaginacion,
        cantResultsSelected: "10"
      }));
    }
  }

  static async vistaFormDescarteDistribucion(req, res) {
    const datos = { error: false };
    const { dist } = req.query;

    try {
      // datos.depositosNac = await depositoNacionalServicio.getDepositosNacionales();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/formularios/descartarDistribucion.pug", {
        pretty: true,
        activeLink: "descartar-lote",
        distribucion: dist ?? "",
        paginadores: 1,
        error: datos.error,
        nacional: true,
        formasDescarte
      }));
    }
  }
}