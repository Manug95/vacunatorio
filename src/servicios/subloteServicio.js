import { sequelize } from "../../sequelize.js";
import { Op } from "sequelize";
import { Lote, SubLote, Vacuna, TipoVacuna, Laboratorio } from "../modelos/relaciones.js";
import loteServicio from './loteServicio.js';
import descarteServicio from "./descarteServicio.js";
import Utils, { capturarErroresDeSequelize } from "../../utils.js";
import { NoAffectedRowsError, DataOutOfRangeError } from "../modelos/Errores/errores.js";
import pc from "picocolors";

let instanciaServicio;

class SubLoteServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearSubLote({ provincia, cantidad, lote, transaction }) {
    const sublote = { // fechaSalida y fechaLlegada estan por defecto con la fecha actual
      loteId: lote,
      provinciaId: provincia,
      cantidad
    };

    // const t = await sequelize.transaction();
    try {
      await loteServicio.comprobarLoteNoDescartado(lote);

      const values = await Promise.all([
        SubLote.create(sublote, { transaction }),
        loteServicio.actualizarCantidadVacunas(lote, cantidad, transaction)
      ]);

      // compruebo que se haya realizado la actualizacion del sublote
      if (values[1][0][1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas del lote");

      // await t.commit();
    } catch (error) {
      // await t.rollback();
      
      console.log(pc.red("Error al crear los subLotes"));
      capturarErroresDeSequelize(error);

      if (error instanceof DataOutOfRangeError) {
        throw new Error("No se puede crear un sublote con mas vacunas de las que tiene el lote de origen");
      }
      
      throw new Error("Hubo un problema al realizar la operación");
    }

    return;
  }

  async getSubLotePorId({ id, transaction }) {
    if (transaction) {
      return SubLote.findByPk(id, { transaction: transaction });
    } else {
      return SubLote.findByPk(id);
    }
  }

  async listarSublotesPorProvincia(provinciaId, { offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          [Op.and]: [
            { cantidad: { [Op.gt]: 0 } },
            { descarteId: { [Op.eq]: null } },
            { provinciaId }
          ]
        },
        include: [
          {
            model: Lote,
            required: true,
            attributes: { exclude: ["fechaFabricacion", "fechaCompra", "fechaAdquisicion"] },
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
            ]
          }
        ],
        attributes: { exclude: ["fechaSalida", "fechaLlegada"] }
      }
  
      if (offset) opciones.offset = +offset;
      if (limit) opciones.limit = +limit;
      if (order) opciones.order = [this.#calcularOrderEnTraerSublotesPorProvincia(order, orderType)];
  
      const { rows, count } = await SubLote.findAndCountAll(opciones);
  
      const sublotes = rows.map(sl => {
        return {
          id: sl.id,
          tipoVacuna: sl.Lote.Vacuna.TipoVacuna.tipo,
          cantidad: sl.cantidad,
          vencimiento: Utils.formatearAfechaArgentina(sl.Lote.vencimiento),
          nombreComercial: sl.Lote.Vacuna.nombreComercial,
          laboratorio: sl.Lote.Vacuna.Laboratorio.nombre,
        };
      });
    
      return { sublotes, cantidadSublotes: count };
    } catch (e) {
      console.error(e);
      throw new Error("Error al traer el stock de lotes");
    }
  }

  async actualizarSubLote({ id, cantidad, fechaLlegada, fechaSalida, descarteId, transaction }) {
    if (!id) throw new Error("Falta la id del sublote");

    const subloteActualizado = {};

    if (cantidad) subloteActualizado.cantidad = cantidad;
    if (fechaLlegada) subloteActualizado.fechaLlegada = fechaLlegada;
    if (fechaSalida) subloteActualizado.fechaSalida = fechaSalida;
    if (descarteId) subloteActualizado.descarteId = descarteId;

    if (transaction) {
      return SubLote.update(subloteActualizado, { where: { id }, transaction });
    } else {
      return SubLote.update(subloteActualizado, { where: { id } });
    }
  }

  async descartarSubLote({ subloteId, fecha, motivo, formaDescarte, personalId }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, personalId, transaction: t });
      const [ affectedCount ] = await this.actualizarSubLote({ id: subloteId, descarteId: descarte.id, transaction: t });

      // compruebo que se haya realizado la actualizacion del sublote
      if (affectedCount === 0) throw new NoAffectedRowsError("No se agrego la id del descarte al sublote");

      await t.commit()
    } catch (error) {
      
      await t.rollback();
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async actualizarCantidadVacunas({ id, cantidadADecrementar, transaction }) {
    const optObj = {
      where: {
        id: id
      }
    };

    if (transaction) {
      optObj.transaction = transaction;
    }

    return SubLote.decrement({ cantidad: cantidadADecrementar }, optObj);
  }

  async comprobarSubLoteNoDescartado(id) {
    let sublote;
    try {
      sublote = await this.getSubLotePorId({ id });
    } catch (error) {
      console.log(pc.red("Error al traer el sublote por ID"));
    }

    if (!sublote) throw new Error("No existe el sublote");

    if (sublote.descarteId) throw new Error("No se pueden distribuir vacunas de un sublote descartado");
  }

  async crearSubLoteAutomatico({ provincia, cantidad, tipoVacuna, deposito, transaction }) {
    // ACA ESTOY TRAYENDO TODOS LOS LOTES DEL MISMO TIPO DE VACUNA
    const lotesRecuperados = [];
    try {
      const lotes = await loteServicio.traerLotesDisponiblesParaCrearSublotes({ tipoVacuna, deposito, transaction });
      lotesRecuperados.push(...lotes);
    } catch (error) {
      console.log(pc.red("Error al traer los lotes disponibles"));
      console.error(error);
      throw new Error("Hubo un problema al realizar la operación");
    }

    if (lotesRecuperados.length === 0) throw new Error("No hay lotes de estas vacuans"); 

    // COMO PUEDEN HABER VARIOS LOTES CON LAS VACUNAS REQUERIDAS
    // TENGO QUE CREAR UN SUBLOTE PARA CADA LOTE QUE SE USE
    // HASTA LLEGAR A LA CANTIDAD DE VACUNAS REQUERIDAD
    const sublotes = [];
    const lotesUsados = [];

    for (const lote of lotesRecuperados) {
      const sublote = { // fechaSalida y fechaLlegada estan por defecto con la fecha actual
        loteId: lote.id,
        provinciaId: provincia
      };

      if (lote.cantidad >= cantidad) {
        sublote.cantidad = cantidad;
        lote.cantidad -= cantidad;
        cantidad = 0;
      } else {
        sublote.cantidad = lote.cantidad;
        cantidad -= lote.cantidad;
        lote.cantidad = 0;
      }

      sublotes.push(sublote);
      lotesUsados.push(lote);

      if (cantidad === 0) break;

    }

    // EN ESTE PUNTO TENGO UN ARREGLO CON LOS OBJETOS DE LOS SUBLOTES QUE SON ENCESRIO CREAR
    // const t = await sequelize.transaction();
    try {
      const sublotesPromesas = sublotes.map(sl => SubLote.create(sl, { transaction }));
      const lotesUsadosPromesas = lotesUsados.map(lu => {
        if (lu.cantidad === 0) {
          return loteServicio.actualizarLote({ id: lu.id, cantidad: lu.cantidad, transaction });
        } else {
          return loteServicio.actualizarCantidadVacunas(lu.id, lu.cantidad, transaction);
        }
      });

      const values = await Promise.all([...sublotesPromesas, ...lotesUsadosPromesas]);

      if (values.slice(3, 6).some(v => v[0] === 0)) throw new Error("");
      // console.log(values);

      // await t.commit();
    } catch (error) {
      console.log(pc.red("Error al crear los subLotes"));
      console.error(error);
      // await t.rollback();
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }

    return { cantidadVacRestantes: cantidad, cantidadSublotes: sublotes.length };
  }

  #calcularOrderEnTraerSublotesPorProvincia(order, orderType) {
    let orderArray;

    if (order === "tipo-vacuna") {
      orderArray = [Lote, Vacuna, TipoVacuna, "tipo", orderType];
    }

    if (order === "cantidad") {
      orderArray = ["cantidad", orderType];
    }

    if (order === "vencimiento") {
      orderArray = [Lote, "vencimiento", orderType];
    }

    if (order === "nombre-comercial") {
      orderArray = [Lote, Vacuna, "nombreComercial", orderType];
    }

    if (order === "laboratorio") {
      orderArray = [Lote, Vacuna, Laboratorio, "nombre", orderType];
    }

    return orderArray;
  }
}

const subLoteServicio = Object.freeze(new SubLoteServicio());

export default subLoteServicio;