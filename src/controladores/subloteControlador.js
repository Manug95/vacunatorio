import { sequelize } from "../../sequelize.js";
import loteServicio from "../servicios/loteServicio.js";
import provinciaServicio from "../servicios/provinciaServicio.js";
import subLoteServicio from "../servicios/subloteServicio.js";
import pug from "pug";
import vacunaServicio from "../servicios/vacunaServicio.js";
import solicitudesServicio from "../servicios/solicitudServicio.js";
import depositoNacionalServicio from "../servicios/depositoNacionalServicio.js";
import personalServicio from "../servicios/personalServicio.js";
import { NoAffectedRowsError } from "../modelos/Errores/errores.js";
import { formasDescarte, cantResultsPorPaginacion } from "../../utils.js";

export default class SubLoteControlador {
  
  static async crear(req, res) {
    let status = 201;
    const respuesta = { ok: true };
    // const { lote, provincia, cantidad, solicitud } = req.body;
    const { tipoVacuna, provincia, cantidad, deposito, solicitud } = req.body;
    // console.log(req.body);

    const transaction = await sequelize.transaction();
    try {
      // const [ lote, prov ] = await Promise.all([
      //   loteServicio.traerLotePorTipoVacuna({ tipoVacuna, cantidad }),
      //   provinciaServicio.getProvinciaPorNombre({ nombre: provincia })
      // ]);
      // const lote = await loteServicio.traerLotePorTipoVacuna({ tipoVacuna, cantidad });
      // const prov = await provinciaServicio.getProvinciaPorNombre({ nombre: provincia });
      // await subLoteServicio.crearSubLote({ provincia: prov.nombre, cantidad, lote: lote.id });

      //aca empieza lo actual no automatico
      // const lote = await loteServicio.traerLotePorTipoVacunaYDeposito({ tipoVacuna, cantidad, deposito });
      // // console.log(lote);

      // if (!lote) throw new Error("No hay de estas vacunas en el deposito seleccionado");

      // const promesas = [subLoteServicio.crearSubLote({ provincia, cantidad, lote: lote.id, transaction })];
      // if (solicitud) promesas.push(solicitudesServicio.actualizarSolicitudSublote({ id: solicitud, estado: "COMPRADA", transaction }));

      // const values = await Promise.all(promesas);
      // console.log(values);

      //aca empieza lo actual automatico
      const { cantidadSublotes, cantidadVacRestantes } = await subLoteServicio.crearSubLoteAutomatico({ tipoVacuna, provincia, cantidad, deposito, transaction });
      const vacunasEnviadas = cantidad - cantidadVacRestantes;
      const updateResult = await solicitudesServicio.actualizarCantidadVacunasSolicitudSublote(solicitud, vacunasEnviadas, transaction);

      // compruebo que se haya realizado la actualizacion del sublote
      if (updateResult[1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas del lote");

      respuesta.mensaje = `Se crearon ${cantidadSublotes} sublote(s)<br>Total de vacunas enviadas: ${vacunasEnviadas}<br>Vacunas sin enviar: ${cantidadVacRestantes}`;

      await transaction.commit();
    }
    catch (error) {
      await transaction.rollback();
      
      status = 400;
      respuesta.ok = false;
      respuesta.mensaje = error instanceof NoAffectedRowsError ? "No se pudo completar la operación" : error.message;
    }
    finally {
      res.status(status).json(respuesta);
    }

  }

  static async descartar(req, res) {
    let statusCode = 200;
    const respuesta = { ok: true };
    const { sublote, codigo, fecha, motivo, formaDescarte } = req.body;
    const codigoCompleto = "C-" + codigo;

    try {
      const personal = await personalServicio.traerPersonalPorCodigo({ codigo: codigoCompleto });

      if (!personal) throw new Error("El código no existe");

      await subLoteServicio.descartarSubLote({ subloteId: sublote, fecha, motivo, formaDescarte, personalId: personal.id });
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

  static async listarSublotes(req, res) {
    const { provinciaId } = req.params;

    let status = 200;
    const respuesta = {};

    try {
      const [ sublotesDeLaProvinciaSeleccionada, provinciaSeleccionada ] = await Promise.all([
        subLoteServicio.listarSublotesPorProvincia(provinciaId, req.query),
        provinciaServicio.getProvinciaPorID({ id: provinciaId })
      ]);

      respuesta.provinciaSeleccionada = provinciaSeleccionada.nombre;
      respuesta.sublotes = sublotesDeLaProvinciaSeleccionada.sublotes;

      const limit = req.query.limit ?? 10;
      respuesta.paginadores = Math.floor(sublotesDeLaProvinciaSeleccionada.cantidadSublotes / limit + 1) ?? 1;
      
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

  static async vistaFormCrearSublote(req, res) {
    const resultadosConsultas = {};
    const { sol, tipoVac, prov, cant } = req.query;

    try {
      const [ provincias, vacunas, depositos ] = await Promise.all([
        provinciaServicio.getProvincias(),
        vacunaServicio.getTiposDeVacunas(),
        depositoNacionalServicio.getDepositosNacionales()
      ]);

      resultadosConsultas.provincias = provincias;
      resultadosConsultas.depositos = depositos;
      resultadosConsultas.vacunas = vacunas.map(v => v.toJSON());
      
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/crearSubLote.pug", {
        pretty: true,
        activeLink: "crear-sub",
        cant,
        provSel: prov,
        tipoVac,
        depositos: resultadosConsultas.depositos,
        provincias: resultadosConsultas.provincias,
        sol,
        vacunas: resultadosConsultas.vacunas
      }));
    }
  }

  static async vistaListadoSublotes(req, res) {
    const datos = { error: false };

    try {
      datos.provincias = await provinciaServicio.getProvincias();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/listados/listadodeStock.pug", {
        pretty: true,
        activeLink: "listado-sublotes",
        provincias: datos.provincias,
        paginadores: 1,
        error: datos.error,
        provincial: true,
        cantResultsPorPaginacion,
        cantResultsSelected: "10"
      }));
    }

  }

  static async vistaFormDescartarSublote(req, res) {
    const datos = { error: false };
    const { sublote } = req.query;

    try {
      datos.depositosNac = await depositoNacionalServicio.getDepositosNacionales();
    }
    catch (error) {
      datos.error = true;
      console.log(error.message);
    }
    finally {
      res.send(pug.renderFile("src/vistas/formularios/descartarSublote.pug", {
        pretty: true,
        activeLink: "descartar-lote",
        sublote: sublote ?? "",
        paginadores: 1,
        error: datos.error,
        nacional: true,
        formasDescarte
      }));
    }

  }

}