import { Router } from "express";
import LoteControlador from "../controladores/loteControlador.js";
import { validarNuevoLote, validarDescarteLote } from "../middlewares/validaciones.js";
import { validarPermisos, validarPermisosRutasDinamicas } from "../middlewares/autorizaciones.js";

const loteRouter = Router();

loteRouter.post("/", validarPermisos, validarNuevoLote, LoteControlador.crear);

loteRouter.post("/descartar", validarPermisos, validarDescarteLote, LoteControlador.descartar);

loteRouter.get("/comprar", validarPermisos, LoteControlador.vistaComprarLote);

loteRouter.get("/listado", validarPermisos, LoteControlador.vistaListadoLotes);

loteRouter.get("/listado/:deposito_id", validarPermisosRutasDinamicas('LOGIST_NAC', 'ADMIN_NAC', 'MASTER'), LoteControlador.listarLotes);

loteRouter.get("/descartar", validarPermisos, LoteControlador.vistaFormDescartarLotes);


export default loteRouter;