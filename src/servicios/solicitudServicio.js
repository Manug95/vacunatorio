import { SolicitudSublote, SolicitudMinilote, TipoVacuna, Provincia, CentroVacunacion } from "../modelos/relaciones.js";
import Utils, { capturarErroresDeSequelize } from "../../utils.js";
import { Op } from "sequelize";

let instanciaServicio;

class SolicitudesServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearSolicitudSublote({ tipoVacuna, provincia, cantidad, fechaSolicitud, transaction }) {
    const solicitud = { // fechaSolicitud y estado se crear con sus valores por defecto
      tipoVacunaId: tipoVacuna,
      provinciaId: provincia,
      cantidad
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

  async crearSolicitudMinilote({ tipoVacuna, centro, cantidad, fechaSolicitud, transaction }) {
    const solicitud = { // fechaSolicitud y estado se crear con sus valores por defecto
      tipoVacunaId: tipoVacuna,
      centroId: centro,
      cantidad
    };

    if (fechaSolicitud) solicitud.fechaSolicitud = fechaSolicitud;

    try {

      if (transaction) {
        return await SolicitudMinilote.create(solicitud, { transaction: transaction });
      } else {
        return await SolicitudMinilote.create(solicitud);
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

  async actualizarSolicitudMinilote({ id, tipoVacuna, centro, cantidad, fechaSolicitud, transaction }) {
    if (!id) throw new Error("Falta la id de la solicitud");

    const solicitudActualizada = {};

    if (cantidad) solicitudActualizada.cantidad = cantidad;
    if (tipoVacuna) solicitudActualizada.tipoVacunaId = tipoVacuna;
    if (centro) solicitudActualizada.centroId = centro;
    if (estado) solicitudActualizada.estado = estado;
    if (fechaSolicitud) solicitudActualizada.fechaSolicitud = fechaSolicitud;

    if (transaction) {
      return SolicitudMinilote.update(solicitudActualizada, { where: { id }, transaction });
    } else {
      return SolicitudMinilote.update(solicitudActualizada, { where: { id } });
    }
  }

  async listarSolicitudesSublote({ offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          cantidad: {
            [Op.gt]: 0
          }
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
      if (order) opciones.order = [this.#calcularElOrdenDelListadoDeSolicitudesSublote(order, orderType)];
  
      const { rows, count } = await SolicitudSublote.findAndCountAll(opciones);
  
      const solicitudes = rows.map(s => {
        return {
          id: s.id,
          provincia: s.Provincium.nombre,
          tipoVacuna: s.TipoVacuna.tipo,
          cantidad: s.cantidad,
          fechaSolicitud: Utils.formatearAfechaArgentina(s.fechaSolicitud),
        };
      });
    
      return { solicitudes, cantidadSolicitudes: count };
    } catch (e) {
      throw new Error("Error al traer las solicitudes de sublotes");
    }
  }

  async listarSolicitudesMinilote({ offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          cantidad: {
            [Op.gt]: 0
          }
        },
        include: [
          {
            model: TipoVacuna,
            required: true
          },
          {
            model: CentroVacunacion,
            required: true
          }
        ]
      }
  
      if (offset) opciones.offset = +offset;
      if (limit) opciones.limit = +limit;
      if (order) opciones.order = [this.#calcularElOrdenDelListadoDeSolicitudesMinilote(order, orderType)];
  
      const { rows, count } = await SolicitudMinilote.findAndCountAll(opciones);
  
      const solicitudes = rows.map(s => {
        return {
          id: s.id,
          centro: s.CentroVacunacion.nombre,
          tipoVacuna: s.TipoVacuna.tipo,
          cantidad: s.cantidad,
          fechaSolicitud: Utils.formatearAfechaArgentina(s.fechaSolicitud),
        };
      });
    
      return { solicitudes, cantidadSolicitudes: count };
    } catch (e) {
      throw new Error("Error al traer las solicitudes de minilotes");
    }
  }

  async actualizarCantidadVacunasSolicitudSublote(id, cantidadADecrementar, transaction) {
    const optObj = {
      where: {
        id: id
      }
    };

    if (transaction) {
      optObj.transaction = transaction;
    }
    
    return SolicitudSublote.decrement({ cantidad: cantidadADecrementar }, optObj);
  }

  async actualizarCantidadVacunasSolicitudMinilote(id, cantidadADecrementar, transaction) {
    const optObj = {
      where: {
        id: id
      }
    };

    if (transaction) {
      optObj.transaction = transaction;
    }
    
    return SolicitudMinilote.decrement({ cantidad: cantidadADecrementar }, optObj);
  }

  #calcularElOrdenDelListadoDeSolicitudesSublote(order, direccion) {
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

  #calcularElOrdenDelListadoDeSolicitudesMinilote(order, direccion) {
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
  
    if (order === "centro") {
      orden.push(...[CentroVacunacion, "nombre", direccion]);
    }
  
    return orden;
  }

}

const solicitudesServicio = Object.freeze(new SolicitudesServicio());

export default solicitudesServicio;