import { Router } from "express";
import MiniLoteControlador from "../controladores/miniloteControlador.js";
import { validarRedistribucionMniLote, validarDistribucionMniLote } from "../middlewares/validaciones.js";

const miniloteRouter = Router();

miniloteRouter.post("/", validarDistribucionMniLote, MiniLoteControlador.distribuir);

miniloteRouter.post("/redistribuir", validarRedistribucionMniLote, MiniLoteControlador.redistribuir);


export { miniloteRouter };