import { Router } from "express";
import SubLoteControlador from "../controladores/subloteControlador.js";
import { validarNuevoSubLote, validarDescarteSubLote } from "../middlewares/validaciones.js";

const subloteRouter = Router();

subloteRouter.post("/", validarNuevoSubLote, SubLoteControlador.crear);

subloteRouter.post("/descartar", validarDescarteSubLote, SubLoteControlador.descartar);


export { subloteRouter };