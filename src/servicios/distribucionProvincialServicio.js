import { sequelize } from "../../sequelize.js";
import { Op } from "sequelize";
import { DistribucionProvincial } from "../modelos/relaciones.js";
import miniloteServicio from "./miniloteServicio.js";
import subLoteServicio from "./subloteServicio.js";
import descarteServicio from "./descarteServicio.js";
import { capturarErroresDeSequelize } from "../../utils.js";
import { NoAffectedRowsError, DataOutOfRangeError } from "../modelos/Errores/errores.js";
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
      await subLoteServicio.comprobarSubLoteNoDescartado(subloteId);

      let miniloteCreado;
      try {
        miniloteCreado = await miniloteServicio.crearMiniLote({ subloteId, transaction: t });
      } catch (error) {
        console.log(pc.red("Error al crear el minilote"));
        throw error;
      }

      const values = await Promise.all([
        this.crearDistribucion({ miniloteId: miniloteCreado.id, cantidad, centroId, transaction: t }),
        subLoteServicio.actualizarCantidadVacunas({ id: subloteId, cantidadADecrementar: cantidad, transaction: t })
      ]);

      // compruebo que se haya realizado la actualizacion del sublote
      if (values[1][0][1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas del sublote");

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(pc.red("Error al distribuir el minilote"));

      capturarErroresDeSequelize(error);

      if (error instanceof DataOutOfRangeError) {
        throw new Error("No se puede crear un minilote con mas vacunas de las que tiene el sublote de origen");
      }
      
      throw new Error("Hubo un problema al realizar la operación");
    }

    return;
  }

  async redistribuirMiniLote({ miniloteId, cantidad, centroOrigen, centroDestino, distribucionId }) {
    this.comprobarDistribucionNoDescartada(distribucionId);

    const transaction = await sequelize.transaction();
    try {
      const values = await Promise.all([
        this.crearDistribucion({ miniloteId, cantidad, centroId: centroDestino, redistribuidoPor: centroOrigen, transaction }),
        this.actualizarCantidadVacunas({ id: distribucionId, cantidadADecrementar: cantidad, transaction })
      ]);

      // compruebo que se haya realizado la actualizacion del sublote
      if (values[1][0][1] === 0) throw new NoAffectedRowsError("No se actualizó la cantidad de vacunas de la distribución");

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      console.log(pc.red("Error al redistribuir el minilote"));
      capturarErroresDeSequelize(error);

      if (error instanceof DataOutOfRangeError) {
        throw new Error("No se puede redistribuir con mas vacunas de las que tiene el minilote de origen");
      }
      
      throw new Error("Hubo un problema al realizar la operación");
    }
  }

  async descartarDistribucion({ id, fecha, motivo, formaDescarte }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, transaction: t });
      const [ affectedCount ] = await this.actualizarDistribucion({ id, descarteId: descarte.id, transaction: t });

      // compruebo que se haya realizado la actualizacion del sublote
      if (affectedCount === 0) throw new NoAffectedRowsError("No se agrego la id del descarte a la distribucion descartada");

      await t.commit()
    } catch (error) {

      await t.rollback();
      capturarErroresDeSequelize(error);
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

  async buscarDistribucionPorMiniloteYCentro({ miniloteId, centroId }) {
    if (!miniloteId) throw new Error("Falta el minilote");
    if (!centroId) throw new Error("Falta el centro de vacunación");

    return DistribucionProvincial.findOne({ 
      where: { 
        [Op.and]: [
          { miniloteId }, 
          { centroId }, 
          { cantidad: { 
              [Op.gt]: 0
            } 
          }
        ] 
      } 
    });
  }
  
}

const distribucionProvincialServicio = Object.freeze(new DistribucionProvincialServicio());

export default distribucionProvincialServicio;