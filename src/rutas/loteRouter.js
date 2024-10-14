import { Router } from "express";
import LoteControlador from "../controladores/loteControlador.js";
import { validarNuevoLote, validarDescarteLote } from "../middlewares/validaciones.js";

const loteRouter = Router();

loteRouter.post("/", validarNuevoLote, LoteControlador.crear);

loteRouter.post("/descartar", validarDescarteLote, LoteControlador.descartar);


export default loteRouter;