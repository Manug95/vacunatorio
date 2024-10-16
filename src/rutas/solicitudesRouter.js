import { Router } from "express";
import SolicitudesControlador from "../controladores/solicitudesControlador.js";
import { validarSolicitudSublote } from "../middlewares/validaciones.js";

const solicitudesRouter = Router();

solicitudesRouter.post("/sublote", validarSolicitudSublote, SolicitudesControlador.crearSolicitudSublote);

solicitudesRouter.get("/sublote", SolicitudesControlador.listarSolicitudesSublote);


export default solicitudesRouter;