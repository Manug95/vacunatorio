// import { Almacena } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";

let instanciaServicio;

class AlmacenaServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async almacenarLote({ lote, deposito }, transaction) {
    if (!deposito) {
      throw new Error("Es necesario especificar en que deposito nacional se va a guardar el nuevo lote");
    }

    if (!lote) {
      throw new Error("Se necesita el lote que se va a almacenar");
    }

    const almacen = {
      loteId: lote,
      depositoId: deposito,
    };

    try {

      if (transaction) {
        await Almacena.create(almacen, { transaction: transaction });
      } else {
        await Almacena.create(almacen);
      }

    } catch (error) {
      capturarErroresDeSequelize(error);
      throw new Error("Ocurrió un error al almacenar el lote comprado");
    }
  }

  async traerLotesAlmacenados(opcionesConsulta) {
    if (opcionesConsulta) {
      return Almacena.findAndCountAll(opcionesConsulta);
    } else {
      return Almacena.findAndCountAll();
    }
  }
}

const almacenaServicio = Object.freeze(new AlmacenaServicio());

export default almacenaServicio;