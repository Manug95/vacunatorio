import { Router } from "express";
import VacunacionControlador from "../controladores/vacunacionControlador.js";
import { validarVacunacion } from "../middlewares/validaciones.js";
import { validarPermisos } from "../middlewares/autorizaciones.js";

const vacunacionRouter = Router();

vacunacionRouter.post("/", validarPermisos, validarVacunacion, VacunacionControlador.crear);

vacunacionRouter.get("/", validarPermisos, VacunacionControlador.vistaFormVacunacion);


export default vacunacionRouter;