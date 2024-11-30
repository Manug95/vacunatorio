import { Router } from "express";
import SubLoteControlador from "../controladores/subloteControlador.js";
import { validarNuevoSubLote, validarDescarteSubLote } from "../middlewares/validaciones.js";
import { validarPermisos, validarPermisosRutasDinamicas } from "../middlewares/autorizaciones.js";

const subloteRouter = Router();

subloteRouter.post("/", validarPermisos, validarNuevoSubLote, SubLoteControlador.crear);

subloteRouter.post("/descartar", validarPermisos, validarDescarteSubLote, SubLoteControlador.descartar);

subloteRouter.get("/crear", validarPermisos, SubLoteControlador.vistaFormCrearSublote);

subloteRouter.get("/listado", validarPermisos, SubLoteControlador.vistaListadoSublotes);

subloteRouter.get("/listado/:provinciaId", validarPermisosRutasDinamicas('ADMIN_PROV', 'LOGIST_PROV', 'MASTER'), SubLoteControlador.listarSublotes);

subloteRouter.get("/descartar", validarPermisos, SubLoteControlador.vistaFormDescartarSublote);


export default subloteRouter;