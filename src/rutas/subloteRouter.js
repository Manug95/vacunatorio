import { Router } from "express";
import SubLoteControlador from "../controladores/subloteControlador.js";
import { validarNuevoSubLote } from "../middlewares/validaciones.js";

const subloteRouter = Router();

subloteRouter.post("/", validarNuevoSubLote, SubLoteControlador.crear);


export { subloteRouter };