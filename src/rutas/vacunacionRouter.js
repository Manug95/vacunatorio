import { Router } from "express";
import VacunacionControlador from "../controladores/vacunacionControlador.js";
import { validarVacunacion } from "../middlewares/validaciones.js";

const vacunacionRouter = Router();

vacunacionRouter.post("/", validarVacunacion, VacunacionControlador.crear);


export default vacunacionRouter;