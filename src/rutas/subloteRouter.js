import { Router } from "express";
import SubLoteControlador from "../controladores/subloteControlador.js";
import { validarNuevoSubLote, validarDescarteSubLote } from "../middlewares/validaciones.js";

const subloteRouter = Router();

subloteRouter.post("/", validarNuevoSubLote, SubLoteControlador.crear);

subloteRouter.post("/descartar", validarDescarteSubLote, SubLoteControlador.descartar);

subloteRouter.get("/crear", SubLoteControlador.vistaFormCrearSublote);

subloteRouter.get("/listado", SubLoteControlador.vistaListadoSublotes);

subloteRouter.get("/listado/:provinciaId", SubLoteControlador.listarSublotes);

subloteRouter.get("/descartar", SubLoteControlador.vistaFormDescartarSublote);


export default subloteRouter;