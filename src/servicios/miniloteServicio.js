import { sequelize } from "../../sequelize.js";
import { MiniLote } from "../modelos/relaciones.js";
import distribucionProvincialServicio from "./distribucionProvincialServicio.js";
import subLoteServicio from "./subloteServicio.js";
import { capturarErroresDeSequelize } from "../../utils.js";
import pc from "picocolors";

let instanciaServicio;

class MiniLoteServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crearMiniLote({ subloteId, transaction }) {
    const minilote = {
      subloteId
    };

    if (transaction) {
      return MiniLote.create(minilote, { transaction });
    } else {
      return MiniLote.create(minilote);
    }
  }
}

const miniLoteServicio = Object.freeze(new MiniLoteServicio());

export default miniLoteServicio;