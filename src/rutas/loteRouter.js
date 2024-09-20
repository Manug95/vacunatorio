import { Router } from "express";
import LoteControlador from "../controladores/loteControlador.js";
import { validarNuevoLote } from "../middlewares/validaciones.js";

const loteRouter = Router();

loteRouter.post("/", validarNuevoLote, LoteControlador.crear);


export { loteRouter };