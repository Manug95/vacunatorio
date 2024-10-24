import { Router } from "express";
import MiniLoteControlador from "../controladores/miniloteControlador.js";
import { validarRedistribucionMiniLote, validarDistribucionMiniLote, validarDescarteDistribucionProvincial } from "../middlewares/validaciones.js";

const miniloteRouter = Router();

miniloteRouter.post("/", validarDistribucionMiniLote, MiniLoteControlador.distribuir);

miniloteRouter.post("/redistribuir", validarRedistribucionMiniLote, MiniLoteControlador.redistribuir);

miniloteRouter.post("/descartar", validarDescarteDistribucionProvincial, MiniLoteControlador.descartar);

miniloteRouter.get("/crear", MiniLoteControlador.vistaFormCrearMinilote);

miniloteRouter.get("/listado", MiniLoteControlador.vistaListadoDistribuciones);

miniloteRouter.get("/descartar", MiniLoteControlador.vistaFormDescarteDistribucion);

miniloteRouter.get("/listado/:centroId", MiniLoteControlador.listarDistribuciones);

miniloteRouter.get("/redistribuir", MiniLoteControlador.vistaFormRedistribuirMinilote);


export default miniloteRouter;