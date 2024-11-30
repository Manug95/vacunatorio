import { Router } from "express";
import MiniLoteControlador from "../controladores/miniloteControlador.js";
import { validarRedistribucionMiniLote, validarDistribucionMiniLote, validarDescarteDistribucionProvincial } from "../middlewares/validaciones.js";
import { validarPermisos, validarPermisosRutasDinamicas } from "../middlewares/autorizaciones.js";

const miniloteRouter = Router();

miniloteRouter.post("/", validarPermisos, validarDistribucionMiniLote, MiniLoteControlador.distribuir);

miniloteRouter.post("/redistribuir", validarPermisos, validarRedistribucionMiniLote, MiniLoteControlador.redistribuir);

miniloteRouter.post("/descartar", validarPermisos, validarDescarteDistribucionProvincial, MiniLoteControlador.descartar);

miniloteRouter.get("/crear", validarPermisos, MiniLoteControlador.vistaFormCrearMinilote);

miniloteRouter.get("/listado", validarPermisos, MiniLoteControlador.vistaListadoDistribuciones);

miniloteRouter.get("/descartar", validarPermisos, MiniLoteControlador.vistaFormDescarteDistribucion);

miniloteRouter.get("/listado/:centroId", validarPermisosRutasDinamicas('ADMIN_CEN', 'LOGIST_CEN', 'MASTER'), MiniLoteControlador.listarDistribuciones);

miniloteRouter.get("/redistribuir", validarPermisos, MiniLoteControlador.vistaFormRedistribuirMinilote);

miniloteRouter.get("/distribucion", validarPermisos, MiniLoteControlador.listarVacunasPorCentro);


export default miniloteRouter;