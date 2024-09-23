import { sequelize } from "../../sequelize.js";
import { SubLote } from "../modelos/relaciones.js";
import loteServicio from './loteServicio.js';
import descarteServicio from "./descarteServicio.js";
import { capturarErroresDeSequelize, esForeignKeyError } from "../../utils.js";
import pc from "picocolors";

let instanciaServicio;

class SubLoteServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearSubLote({ provincia, cantidad, lote }) {
    const sublote = { // fechaSalida y fechaLlegada estan por defecto con la fecha actual
      loteId: lote,
      provinciaId: provincia,
      cantidad
    };

    const t = await sequelize.transaction();
    try {
      // await loteServicio.comprobarLoteNoDescartado(lote);

      await Promise.all([
        SubLote.create(sublote, { transaction: t }),
        loteServicio.actualizarCantidadVacunas(lote, cantidad, t)
      ]);

      await t.commit();
    } catch (error) {
      await t.rollback();
      
      console.log(pc.red("Error al crear los subLotes"));

      if (error.name === "SequelizeDatabaseError" && error.parent.code === "ER_DATA_OUT_OF_RANGE") {
        throw new Error("No se puede crear un sublote con mas vacunas de las que tiene el lote de origen");
      }

      if (esForeignKeyError(error)) {
        console.log(pc.red("Error en una clave foranea al crear el subLote"));
        throw new Error("Provincia o lote incorrecto/s");
      }
      
      capturarErroresDeSequelize(error);
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

  async descartarSubLote({ subloteId, fecha, motivo, formaDescarte }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, transaction: t });
      await this.actualizarSubLote({ id: subloteId, descarteId: descarte.id, transaction: t });

      await t.commit()
    } catch (error) {
      await t.rollback();
      capturarErroresDeSequelize();

      if (esForeignKeyError(error)) {
        console.log(pc.red("Error en una clave foranea al descartar el SubLote"));
        throw new Error("Sub Lote incorrecto");
      } else {
        console.log(pc.red("Error al descartar el SubLote"));
      }

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

  async crearSubLoteAutomatico({ provincia, cantidad, tipoVacuna }) {
    // ACA ESTOY TRAYENDO TODOS LOS LOTES DEL MISMO TIPO DE VACUNA
    const lotesRecuperados = [];
    try {
      const lotes = await loteServicio.traerLotesDisponibles(tipoVacuna);
      lotesRecuperados.push(...lotes);
    } catch (error) {
      console.log(pc.red("Error al traer los lotes disponibles"));
      console.error(error);
      throw new Error("Hubo un problema al realizar la operación");
    }

    if (lotesRecuperados.length === 0) {
      throw new Error("No hay lotes disponibles");
    }

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
    const t = await sequelize.transaction();
    try {
      const sublotesPromesas = sublotes.map(sl => SubLote.create(sl, { transaction: t }));
      const lotesUsadosPromesas = lotesUsados.map(lu => loteServicio.actualizarCantidadVacunas(lu.id, lu.cantidad, t));

      await Promise.all([...sublotesPromesas, ...lotesUsadosPromesas]);

      await t.commit();
    } catch (error) {
      console.log(pc.red("Error al crear los subLotes"));
      console.error(error);
      await t.rollback();
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }

    return;
  }
}

const subLoteServicio = Object.freeze(new SubLoteServicio());

export default subLoteServicio;