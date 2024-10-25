import loteServicio from "../servicios/loteServicio.js";
import depositoNacionalServicio from "../servicios/depositoNacionalServicio.js";
import vacunaServicio from "../servicios/vacunaServicio.js";
import personalServicio from "../servicios/personalServicio.js";
import pug from "pug";
import { cantidadesCompraLote, formasDescarte, motivosDescarte, cantResultsPorPaginacion } from "../../utils.js";

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
    const { lote, fecha, motivo, formaDescarte, codigo } = req.body;
    const codigoCompleto = "C-" + codigo;

    try {
      const personal = await personalServicio.traerPersonalPorCodigo({ codigo: codigoCompleto });

      if (!personal) throw new Error("El código no existe");

      await loteServicio.descartarLote({ loteId: lote, fecha, motivo, formaDescarte, personalId: personal.id });
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

  static async listarLotes(req, res) {
    const { deposito_id } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      const [ lotesDelDepositoSeleccionado, depositoSeleccionado ] = await Promise.all([
        loteServicio.listarLotesPorDeposito(deposito_id, req.query),
        depositoNacionalServicio.getDepositoNacionalPorID({ id: deposito_id })
      ]);

      respuesta.depositoSeleccionado = depositoSeleccionado.nombre;
      respuesta.lotes = lotesDelDepositoSeleccionado.lotes;

      const limit = req.query.limit ?? 10;
      respuesta.paginadores = Math.floor(lotesDelDepositoSeleccionado.cantidadLotes / limit + 1) ?? 1;
      
    }
    catch (error) {
      respuesta.error = true;
      status = 400;
      console.log(error.message);
    }
    finally {
      res.status(status).json(respuesta);
    }

    return;
  }

  static async vistaComprarLote (req, res) {
    const resultadosConsultas = {};
    const { vacunaSolicitada } = req.query;

    try {
      const [ depositosNac, vacunas ] = await Promise.all([
        depositoNacionalServicio.getDepositosNacionales(),
        vacunaServicio.getVacunas()
      ]);

      resultadosConsultas.depositosNac = depositosNac;
      resultadosConsultas.vacunas = vacunas.map(v => v.toJSON());
      
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/comprarLote.pug", {
        pretty: true,
        activeLink: { "comprar": "active-link" },
        depositos: resultadosConsultas.depositosNac ?? [],
        vacunas: resultadosConsultas.vacunas ?? [],
        vacunaSolicitada,
        cantidadesCompraLote
      }));
    }

  }

  static async vistaListadoLotes(req, res) {
    const datos = { error: false };

    try {
      datos.depositosNac = await depositoNacionalServicio.getDepositosNacionales();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/listados/listadodeStock.pug", {
        pretty: true,
        activeLink: { "listado": "active-link" },
        depositosNac: datos.depositosNac,
        paginadores: 1,
        error: datos.error,
        nacional: true,
        cantResultsPorPaginacion,
        cantResultsSelected: "10"
      }));
    }

    return;
  }

  static async vistaFormDescartarLotes(req, res) {
    const datos = { error: false };
    const { lote } = req.query;

    try {
      datos.depositosNac = await depositoNacionalServicio.getDepositosNacionales();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/formularios/descartarLote.pug", {
        pretty: true,
        activeLink: "descartar-lote",
        lote: lote ?? "",
        paginadores: 1,
        error: datos.error,
        nacional: true,
        formasDescarte,
        motivosDescarte
      }));
    }

    return;
  }

}