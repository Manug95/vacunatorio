import { Router } from "express";
import LoteControlador from "../controladores/loteControlador.js";
import { validarNuevoLote, validarDescarteLote } from "../middlewares/validaciones.js";

const loteRouter = Router();

loteRouter.post("/", validarNuevoLote, LoteControlador.crear);

loteRouter.post("/descartar", validarDescarteLote, LoteControlador.descartar);

loteRouter.get("/comprar", LoteControlador.vistaComprarLote);

loteRouter.get("/listado", LoteControlador.vistaListadoLotes);

loteRouter.get("/listado/:deposito_id", LoteControlador.listarLotes);

loteRouter.get("/descartar", LoteControlador.vistaFormDescartarLotes);


export default loteRouter;