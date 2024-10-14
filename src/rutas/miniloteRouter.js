import { Router } from "express";
import MiniLoteControlador from "../controladores/miniloteControlador.js";
import { validarRedistribucionMiniLote, validarDistribucionMiniLote, validarDescarteDistribucionProvincial } from "../middlewares/validaciones.js";

const miniloteRouter = Router();

miniloteRouter.post("/", validarDistribucionMiniLote, MiniLoteControlador.distribuir);

miniloteRouter.post("/redistribuir", validarRedistribucionMiniLote, MiniLoteControlador.redistribuir);

miniloteRouter.post("/descartar", validarDescarteDistribucionProvincial, MiniLoteControlador.descartar);


export default miniloteRouter;