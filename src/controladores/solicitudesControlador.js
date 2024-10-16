import solicitudesServicio from "../servicios/solicitudServicio.js";
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

  // static async vistaComprarLote (req, res) {
  //   const resultadosConsultas = {};
  //   const { vacunaSolicitada } = req.query;

  //   try {
  //     const [ depositosNac, vacunas ] = await Promise.all([
  //       depositoNacionalServicio.getDepositosNacionales(),
  //       vacunaServicio.getVacunas()
  //     ]);

  //     resultadosConsultas.depositosNac = depositosNac;
  //     resultadosConsultas.vacunas = vacunas.map(v => v.toJSON());
      
  //   } catch(e) {
  //     console.error(e);
  //   } finally {
  //     res.send(pug.renderFile("src/vistas/formularios/comprarLote.pug", {
  //       pretty: true,
  //       activeLink: "comprar",
  //       depositos: resultadosConsultas.depositosNac ?? [],
  //       vacunas: resultadosConsultas.vacunas ?? [],
  //       vacunaSolicitada
  //     }));
  //   }

  // }

  // static async vistaListadoLotes(req, res) {
  //   const datos = { error: false };

  //   try {
  //     datos.depositosNac = await depositoNacionalServicio.getDepositosNacionales();
  //   }
  //   catch (error) {
  //     datos.error = true;
  //     console.log(error.message);
  //   }
  //   finally {
  //     res.send(pug.renderFile("src/vistas/listados/listadodeStock.pug", {
  //       pretty: true,
  //       activeLink: "listado-sublotes",
  //       depositosNac: datos.depositosNac,
  //       paginadores: 1,
  //       error: datos.error,
  //       nacional: true
  //     }));
  //   }

  //   return;
  // }

}