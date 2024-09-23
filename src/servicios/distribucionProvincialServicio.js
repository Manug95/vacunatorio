import { sequelize } from "../../sequelize.js";
import { DistribucionProvincial } from "../modelos/relaciones.js";
import miniloteServicio from "./miniloteServicio.js";
import subLoteServicio from "./subloteServicio.js";
import descarteServicio from "./descarteServicio.js";
import { capturarErroresDeSequelize, esForeignKeyError } from "../../utils.js";
import pc from "picocolors";

let instanciaServicio;

class DistribucionProvincialServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearDistribucion({ miniloteId, cantidad, centroId, fechaSalida, fechaLlegada, redistribuidoPor, transaction }) {
    const distribucion = { // fechaSalida y fechaLlegada estan por defecto con la fecha actual
        miniloteId,
        centroId,
        cantidad
    };

    if (fechaSalida) distribucion.fechaSalida = fechaSalida;
    if (fechaLlegada) distribucion.fechaLlegada = fechaLlegada;
    if (redistribuidoPor) distribucion.redistribuidoPor = redistribuidoPor;

    if (transaction) {
        return DistribucionProvincial.create(distribucion, { transaction: transaction });
    } else {
        return DistribucionProvincial.create(distribucion);
    }
  }

  async actualizarDistribucion({ id, cantidad, fechaSalida, fechaLlegada, descarteId, transaction }) {
    if (!id) throw new Error("Falta la id de la distribucion");

    const distribucionActualizada = {};

    if (cantidad) distribucionActualizada.cantidad = cantidad;
    if (fechaSalida) distribucionActualizada.fechaSalida = fechaSalida;
    if (fechaLlegada) distribucionActualizada.fechaLlegada = fechaLlegada;
    if (descarteId) distribucionActualizada.descarteId = descarteId;

    if (transaction) {
      return DistribucionProvincial.update(distribucionActualizada, { where: { id }, transaction });
    } else {
      return DistribucionProvincial.update(distribucionActualizada, { where: { id } });
    }
  }

  async getDistribucionPorId({ id, transaction }) {
    if (transaction) {
      return DistribucionProvincial.findByPk(id, { transaction: transaction });
    } else {
      return DistribucionProvincial.findByPk(id);
    }
  }

  async distribuirMiniLote({ subloteId, cantidad, centroId, transaction }) {
    const t = transaction ?? await sequelize.transaction();
    try {
      // await subLoteServicio.comprobarSubLoteNoDescartado(subloteId);

      let miniloteCreado;
      try {
        miniloteCreado = await miniloteServicio.crearMiniLote({ subloteId, transaction: t });
      } catch (error) {
        console.log(pc.red("Error al crear el minilote"));
        if (esForeignKeyError(error)) {
          console.log(pc.red("Error en la clave foranea 'subLoteId' al crear el miniLote"));
          throw new Error("El Sublote es invalido");
        } else {
          throw error;
        }
      }

      await Promise.all([
        this.crearDistribucion({ miniloteId: miniloteCreado.id, cantidad, centroId, transaction: t }),
        subLoteServicio.actualizarCantidadVacunas({ id: subloteId, cantidadADecrementar: cantidad, transaction: t })
      ]);

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(pc.red("Error al distribuir el minilote"));

      if (error.name === "SequelizeDatabaseError" && error.parent.code === "ER_DATA_OUT_OF_RANGE") {
        throw new Error("No se puede crear un minilote con mas vacunas de las que tiene el sublote de origen");
      }

      if (esForeignKeyError(error)) {
        console.log(pc.red("Error en la clave foranea 'centroId' al distribuir el miniLote"));
        throw new Error("Centro de vacunación incorrecto");
      }
      
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }

    return;
  }

  async redistribuirMiniLote({ miniloteId, cantidad, centroOrigen, centroDestino, distribucionId }) {
    // this.#comprobarDistribucionNoDescartada(distribucionId);

    const transaction = await sequelize.transaction();
    try {
      await Promise.all([
        this.crearDistribucion({ miniloteId, cantidad, centroId: centroDestino, redistribuidoPor: centroOrigen, transaction }),
        this.actualizarCantidadVacunas({ id: distribucionId, cantidadADecrementar: cantidad, transaction })
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      console.log(pc.red("Error al redistribuir el minilote"));

      if (error.name === "SequelizeDatabaseError" && error.parent.code === "ER_DATA_OUT_OF_RANGE") {
        throw new Error("No se puede redistribuir con mas vacunas de las que tiene el minilote de origen");
      }

      if (esForeignKeyError(error)) {
        console.log(pc.red("Error en la clave foranea del centro origen o el centro destino al redistribuir el miniLote"));
        throw new Error("Centro de vacunación incorrecto");
      }
      
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }
  }

  async descartarDistribucion({ id, fecha, motivo, formaDescarte }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, transaction: t });
      await this.actualizarDistribucion({ id, descarteId: descarte.id, transaction: t });

      await t.commit()
    } catch (error) {
      await t.rollback();
      capturarErroresDeSequelize();

      if (esForeignKeyError(error)) {
        console.log(pc.red("Error en una clave foranea al descartar la distribucion"));
        throw new Error("distribucion incorrecta");
      } else {
        console.log(pc.red("Error al descartar la distribucion"));
      }

      throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async comprobarDistribucionNoDescartada(id) {
    let distribucion;
    try {
      distribucion = await this.getDistribucionPorId({ id });
    } catch (error) {
      console.log(pc.red("Error al traer la distribucion por ID"));
    }

    if (!distribucion) throw new Error("No existe la distribucion");

    if (distribucion.descarteId) throw new Error("No se pueden redistribuir vacunas descartadas");
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

    return DistribucionProvincial.decrement({ cantidad: cantidadADecrementar }, optObj);
  }
}

const distribucionProvincialServicio = Object.freeze(new DistribucionProvincialServicio());

export default distribucionProvincialServicio;