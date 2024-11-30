import { Router } from "express";
import PacienteControlador from "../controladores/pacienteControlador.js";
import { validarNuevoPaciente } from "../middlewares/validaciones.js";
import { validarPermisos } from "../middlewares/autorizaciones.js";

const pacienteRouter = Router();

pacienteRouter.post("/", validarPermisos, validarNuevoPaciente, PacienteControlador.crear);

pacienteRouter.get("/registrar", validarPermisos, PacienteControlador.vistaFormRegistrarPaciente);


export default pacienteRouter;