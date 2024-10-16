import { SolicitudSublote, TipoVacuna, Provincia } from "../modelos/relaciones.js";
import Utils, { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class SolicitudesServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearSolicitudSublote({ tipoVacuna, provincia, cantidad, fechaSolicitud, transaction }) {
    const solicitud = {
      tipoVacunaId: tipoVacuna,
      provinciaId: provincia,
      cantidad,
      estado: "PENDIENTE"
    };

    if (fechaSolicitud) solicitud.fechaSolicitud = fechaSolicitud;

    try {

      if (transaction) {
        return await SolicitudSublote.create(solicitud, { transaction: transaction });
      } else {
        return await SolicitudSublote.create(solicitud);
      }

    } catch (error) {
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al almacenar el lote comprado");
    }
  }

  async actualizarSolicitudSublote({ id, tipoVacuna, provincia, cantidad, estado, fechaSolicitud, transaction }) {
    if (!id) throw new Error("Falta la id de la solicitud");

    const solicitudActualizada = {};

    if (cantidad) solicitudActualizada.cantidad = cantidad;
    if (tipoVacuna) solicitudActualizada.tipoVacunaId = tipoVacuna;
    if (provincia) solicitudActualizada.provinciaId = provincia;
    if (estado) solicitudActualizada.estado = estado;
    if (fechaSolicitud) solicitudActualizada.fechaSolicitud = fechaSolicitud;

    if (transaction) {
      return SolicitudSublote.update(solicitudActualizada, { where: { id }, transaction });
    } else {
      return SolicitudSublote.update(solicitudActualizada, { where: { id } });
    }
  }

  async listarSolicitudesSublote({ offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          estado: "PENDIENTE"
        },
        include: [
          {
            model: TipoVacuna,
            required: true
          },
          {
            model: Provincia,
            required: true
          }
        ]
      }
  
      if (offset) opciones.offset = +offset;
      if (limit) opciones.limit = +limit;
      if (order) opciones.order = [this.#calcularElOrdenDelListadoDeSolicitudes(order, orderType)];
  
      const { rows, count } = await SolicitudSublote.findAndCountAll(opciones);
  
      const solicitudes = rows.map(s => {
        return {
          id: s.id,
          tipoVacuna: s.TipoVacuna.tipo,
          cantidad: s.cantidad,
          fechaSolicitud: Utils.formatearAfechaArgentina(s.fechaSolicitud),
          provincia: s.Provincia.nombre,
        };
      });
    
      return { solicitudes, cantidadSolicitudes: count };
    } catch (e) {
      console.error(e);
      throw new Error("Error al traer las solicitudes de sublotes");
    }
  }

  #calcularElOrdenDelListadoDeSolicitudes(order, direccion) {
    const orden = [];
  
    if (order === "tipo-vacuna") {
      orden.push(...[TipoVacuna, "tipo", direccion]);
    }
  
    if (order === "fecha") {
      orden.push(...["fechaSolicitud", direccion]);
    }
  
    if (order === "cantidad") {
      orden.push(...["cantidad", direccion]);
    }
  
    if (order === "provincia") {
      orden.push(...[Provincia, "nombre", direccion]);
    }
  
    return orden;
  }

}

const solicitudesServicio = Object.freeze(new SolicitudesServicio());

export default solicitudesServicio;