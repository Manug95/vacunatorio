import { Router } from "express";
import ConsultasControlador from "../controladores/consultasControlador.js";
// import { validarNuevoLote, validarDescarteLote } from "../middlewares/validaciones.js";

const consultasRouter = Router();

consultasRouter.get("/:consulta", ConsultasControlador.antenderConsulta);

consultasRouter.get("/vista/consulta1", ConsultasControlador.vistaCantVacunasPorLaboratorioPorFecha);


export default consultasRouter;