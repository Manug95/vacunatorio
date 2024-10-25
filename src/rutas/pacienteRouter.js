import { Router } from "express";
import PacienteControlador from "../controladores/pacienteControlador.js";
import { validarNuevoPaciente } from "../middlewares/validaciones.js";

const pacienteRouter = Router();

pacienteRouter.post("/", validarNuevoPaciente, PacienteControlador.crear);

pacienteRouter.get("/registrar", PacienteControlador.vistaFormRegistrarPaciente);


export default pacienteRouter;