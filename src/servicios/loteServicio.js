import { Lote, Vacuna, TipoVacuna, Laboratorio } from "../modelos/relaciones.js";
import { Op } from "sequelize";
import { faker } from '@faker-js/faker';
import Utils, { capturarErroresDeSequelize } from "../../utils.js";
import pc from "picocolors";
import descarteServicio from "./descarteServicio.js";
import { sequelize } from "../../sequelize.js";
import { NoAffectedRowsError } from "../modelos/Errores/errores.js";

let instanciaServicio;

class LoteServicio {

  #opcionesDeOrdenamiento;
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
    this.#opcionesDeOrdenamiento = ["cantidad", "vencimiento", "nombre-comercial", "laboratorio", "tipo-vacuna"];
  }

  async crearLote({ vacuna, cantidad, deposito, lote, transaction }) {
    const nroLote = lote ?? this.#crearNroLote();
    const vencimiento = faker.date.future();
    const fechaFabricacion = faker.date.recent();

    const nuevoLote = { // fechaCompra y fechaAdquisicion tienen por defecto la fecha actual
      nroLote,
      vencimiento,
      fechaFabricacion,
      vacunaId: vacuna,
      depositoId: deposito,
      cantidad
    };

    try {

      if (transaction) {
        return await Lote.create(nuevoLote, { transaction: transaction });
      } else {
        return await Lote.create(nuevoLote);
      }

    } catch (error) {
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }
  }

  async actualizarLote({ id, cantidad, fechaAdquisicion, fechaCompra, fechaFabricacion, vencimiento, descarteId, transaction }) {
    if (!id) throw new Error("Falta la id del lote");

    const loteActualizado = {};

    if (cantidad) loteActualizado.cantidad = cantidad;
    if (fechaAdquisicion) loteActualizado.fechaAdquisicion = fechaAdquisicion;
    if (fechaCompra) loteActualizado.fechaCompra = fechaCompra;
    if (fechaFabricacion) loteActualizado.fechaFabricacion = fechaFabricacion;
    if (vencimiento) loteActualizado.vencimiento = vencimiento;
    if (descarteId) loteActualizado.descarteId = descarteId;

    if (transaction) {
      return Lote.update(loteActualizado, { where: { id }, transaction });
    } else {
      return Lote.update(loteActualizado, { where: { id } });
    }
  }

  async descartarLote({ loteId, fecha, motivo, formaDescarte, personalId }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, personalId, transaction: t });
      const [ affectedCount ] = await this.actualizarLote({ id: loteId, descarteId: descarte.id, transaction: t });

      // compruebo que se haya realizado la actualizacion del lote
      if (affectedCount === 0) throw new NoAffectedRowsError("No se agrego la id del descarte al lote");
      
      await t.commit()
    } catch (error) {

      await t.rollback();
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async getLotePorId({ id, transaction }) {
    if (transaction) {
      return Lote.findByPk(id, { transaction: transaction });
    } else {
      return Lote.findByPk(id);
    }
  }

  // conseguir los lotes de las vacunas requeridas
  async traerLotesDisponibles(tipoVacuna) {
    return Lote.findAll({
      attributes: ["id", "nroLote", "vencimiento", "vacunaId", "cantidad"],
      where: {
        [Op.and]: [
          { '$Vacuna.tipoVacunaId$': { [Op.eq]: tipoVacuna } },
          { '$Lote.vencimiento$': { [Op.gt]: new Date() } },
          { '$Lote.cantidad$': { [Op.gt]: 0 } },
          { '$Lote.descarteId$': { [Op.eq]: null } }
        ]
      },
      include: [
        {
          model: Vacuna,
          attributes: ["id", "tipoVacunaId"],
          required: true
        }
      ],
      order: [
        ["vencimiento", "ASC"]
      ]
    });
  }

  async actualizarCantidadVacunas(id, cantidadADecrementar, transaction) {
    const optObj = {
      where: {
        id: id
      }
    };

    if (transaction) {
      optObj.transaction = transaction;
    }
    
    return Lote.decrement({ cantidad: cantidadADecrementar }, optObj);
  }

  async listarLotesPorDeposito(deposito_id, { offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          [Op.and]: [
            { cantidad: { [Op.gt]: 0 } },
            { descarteId: { [Op.eq]: null } },
            { depositoId: deposito_id }
          ]
        },
        include: [
          {
            model: Vacuna,
            required: true,
            include: [
              {
                model: TipoVacuna,
                required: true
              },
              {
                model: Laboratorio,
                attributes: { exclude: ["paisId"] },
                required: true
              }
            ]
          }
        ],
        attributes: { exclude: ["fechaFabricacion", "fechaCompra", "fechaAdquisicion"] }
      }
  
      if (offset) opciones.offset = +offset;
      if (limit) opciones.limit = +limit;
      if (order) opciones.order = [this.#calcularOrderEnTraerLotesPorDeposito(order, orderType)];
  
      const { rows, count } = await Lote.findAndCountAll(opciones);
  
      const lotes = rows.map(l => {
        return {
          id: l.id,
          tipoVacuna: l.Vacuna.TipoVacuna.tipo,
          cantidad: l.cantidad,
          vencimiento: Utils.formatearAfechaArgentina(l.vencimiento),
          nombreComercial: l.Vacuna.nombreComercial,
          laboratorio: l.Vacuna.Laboratorio.nombre,
        };
      });
    
      return { lotes, cantidadLotes: count };
    } catch (e) {
      console.error(e);
      throw new Error("Error al traer el stock de lotes");
    }
  }

  #crearNroLote(segundos) {
    let fecha = new Date();
  
    if (segundos) {
      const ms = fecha.getTime() + (segundos * 1000);
      fecha = new Date(ms);
    }

    const fechaFormateada = fecha.toISOString().replace("T", "/").split(".")[0];

    return "L" + fechaFormateada;
  }

  #calcularOrderEnTraerLotesAlmacenados(order, orderType) {
    if (order === this.#opcionesDeOrdenamiento[0]) {
      return [Lote, "cantidad", orderType];
    }
    
    if (order === this.#opcionesDeOrdenamiento[1]) {
      return [Lote, "vencimiento", orderType];
    }
    
    if (order === this.#opcionesDeOrdenamiento[2]) {
      return [Lote, Vacuna, "nombreComercial", orderType];
    }
    
    if (order === this.#opcionesDeOrdenamiento[3]) {
      return [Lote, Vacuna, Laboratorio, "nombre", orderType];
    }

    if (order === this.#opcionesDeOrdenamiento[4]) {
      return [Lote, Vacuna, TipoVacuna, "tipo", orderType];
    }
  }

  #calcularOrderEnTraerLotesPorDeposito(order, orderType) {
    let orderArray;

    if (order === "tipo-vacuna") {
      orderArray = [Vacuna, TipoVacuna, "tipo", orderType];
    }

    if (order === "cantidad") {
      orderArray = ["cantidad", orderType];
    }

    if (order === "vencimiento") {
      orderArray = ["vencimiento", orderType];
    }

    if (order === "nombre-comercial") {
      orderArray = [Vacuna, "nombreComercial", orderType];
    }

    if (order === "laboratorio") {
      orderArray = [Vacuna, Laboratorio, "nombre", orderType];
    }

    return orderArray;
  }

  #esOrdenValido(orden) {
    return this.#opcionesDeOrdenamiento.includes(orden);
  }

  async comprobarLoteNoDescartado(id) {
    let lote;
    try {
      lote = await this.getLotePorId({ id });
    } catch (error) {
      console.log(pc.red("Error al traer el lote por ID"));
    }

    if (!lote) throw new Error("No existe el lote");

    if (lote.descarteId) throw new Error("No se pueden distribuir vacunas de un lote descartado");
  }
}

const loteServicio = Object.freeze(new LoteServicio());

export default loteServicio;