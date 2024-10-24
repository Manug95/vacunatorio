import { sequelize } from "../../sequelize.js";
import { Op } from "sequelize";
import { DistribucionProvincial, Lote, SubLote, MiniLote, Vacuna, TipoVacuna, Laboratorio } from "../modelos/relaciones.js";
import miniloteServicio from "./miniloteServicio.js";
import subLoteServicio from "./subloteServicio.js";
import descarteServicio from "./descarteServicio.js";
import Utils, { capturarErroresDeSequelize } from "../../utils.js";
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

  async distribuirMiniLoteAutomatico({ tipoVacuna, provincia, cantidad, centro, transaction }) {
    try {
      
      const sublotesRecuperados = [];
      try {
        const sublotes = await subLoteServicio.traerSublotesDisponiblesParaCrearMinilotes({ tipoVacuna, provincia, transaction });
        sublotesRecuperados.push(...sublotes);
      } catch (error) {
        console.log(pc.red("Error al traer los sublotes disponibles"));
        console.error(error);
        throw new Error("Hubo un problema al realizar la operación");
      }

      if (sublotesRecuperados.length === 0) throw new Error("No hay sublotes de estas vacuans");

      const minilotes = [];
      const distribuciones = [];
      const sublotesUsados = [];

      for (const sublote of sublotesRecuperados) {
        const minilote = { 
          subloteId: sublote.id
        };

        const distribucion = {
          redistribuidoPor: null,
          centroId: centro
        };

        if (sublote.cantidad >= cantidad) {
          distribucion.cantidad = cantidad;
          sublote.cantidad -= cantidad;
          cantidad = 0;
        } else {
          distribucion.cantidad = sublote.cantidad;
          cantidad -= sublote.cantidad;
          sublote.cantidad = 0;
        }

        minilotes.push(minilote);
        distribuciones.push(distribucion);
        sublotesUsados.push(sublote);

        if (cantidad === 0) break;

      }

      const minilotesPromesas = minilotes.map(ml => miniloteServicio.crearMiniLote({ subloteId: ml.subloteId, transaction }));
      const sublotesUsadosPromesas = sublotesUsados.map(slu => {
        return subLoteServicio.actualizarSubLote({ id: slu.id, cantidad: slu.cantidad, transaction });
      });

      const values = await Promise.all([...minilotesPromesas, ...sublotesUsadosPromesas]);

      if (values.slice(values.length/2 - 1, values.length).some(v => v[0] === 0)) throw new Error("");

      const distribucionesACrear = distribuciones.map((d, index) => {
        return {
          ...d,
          miniloteId: values[index].id
        }
      });
      const distribucionesProvincialesPromesas = distribucionesACrear.map(d => this.crearDistribucion({...d, transaction}));
 
      await Promise.all(distribucionesProvincialesPromesas);
  
      return { cantidadVacRestantes: cantidad, cantidadMinilotes: minilotes.length };

    } catch (error) {
      console.log(pc.red("Error al distribuir el minilote"));

      capturarErroresDeSequelize(error);

      if (error instanceof DataOutOfRangeError) {
        throw new Error("No se puede crear un minilote con mas vacunas de las que tiene el sublote de origen");
      }
      
      throw new Error("Hubo un problema al realizar la operación");
    }
    
  }

  async redistribuirMiniLote({ miniloteId, cantidad, centroOrigen, centroDestino, distribucionId }) {
    // await this.comprobarDistribucionNoDescartada(distribucionId);

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

  async listarDistribucionesPorCentroVacunacion(centroId, { offset, limit, order, orderType }) {
    try {
      const opciones = {
        where: {
          [Op.and]: [
            { cantidad: { [Op.gt]: 0 } },
            { descarteId: { [Op.eq]: null } },
            { centroId }
          ]
        },
        include: [
          {
            model: MiniLote,
            required: true,
            include: [
              {
                model: SubLote,
                attributes: { exclude: ["fechaSalida", "fechaLlegada"] },
                required: true,
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
                ]
              }
            ]
          }
        ],
        attributes: { exclude: ["fechaSalida", "fechaLlegada", "redistribuidoPor"] }
      }
  
      if (offset) opciones.offset = +offset;
      if (limit) opciones.limit = +limit;
      if (order) opciones.order = [this.#calcularOrderEnTraerMinilotesPorCentroVacunacion(order, orderType)];
  
      const { rows, count } = await DistribucionProvincial.findAndCountAll(opciones);
  
      const distribuciones = rows.map(dist => {
        return {
          id: dist.id,
          tipoVacuna: dist.MiniLote.SubLote.Lote.Vacuna.TipoVacuna.tipo,
          cantidad: dist.cantidad,
          vencimiento: Utils.formatearAfechaArgentina(dist.MiniLote.SubLote.Lote.vencimiento),
          nombreComercial: dist.MiniLote.SubLote.Lote.Vacuna.nombreComercial,
          laboratorio: dist.MiniLote.SubLote.Lote.Vacuna.Laboratorio.nombre,
        };
      });
    
      return { distribuciones, cantidadDistribuciones: count };
    } catch (e) {
      console.error(e);
      throw new Error("Error al traer el stock de lotes");
    }
  }

  async descartarDistribucion({ id, fecha, motivo, formaDescarte, personalId }) {
    const t = await sequelize.transaction();
    try {
      const descarte = await descarteServicio.crearDescarte({ fecha, motivo, formaDescarte, personalId, transaction: t });
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

  #calcularOrderEnTraerMinilotesPorCentroVacunacion(order, orderType) {
    let orderArray;

    if (order === "tipo-vacuna") {
      orderArray = [MiniLote, SubLote, Lote, Vacuna, TipoVacuna, "tipo", orderType];
    }

    if (order === "cantidad") {
      orderArray = ["cantidad", orderType];
    }

    if (order === "vencimiento") {
      orderArray = [MiniLote, SubLote, Lote, "vencimiento", orderType];
    }

    if (order === "nombre-comercial") {
      orderArray = [MiniLote, SubLote, Lote, Vacuna, "nombreComercial", orderType];
    }

    if (order === "laboratorio") {
      orderArray = [MiniLote, SubLote, Lote, Vacuna, Laboratorio, "nombre", orderType];
    }

    return orderArray;
  }
  
}

const distribucionProvincialServicio = Object.freeze(new DistribucionProvincialServicio());

export default distribucionProvincialServicio;