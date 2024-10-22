import { Router } from "express";
import SolicitudesControlador from "../controladores/solicitudesControlador.js";
import { validarSolicitudSublote, validarSolicitudMinilote } from "../middlewares/validaciones.js";

const solicitudesRouter = Router();

solicitudesRouter.post("/sublote", validarSolicitudSublote, SolicitudesControlador.crearSolicitudSublote);

solicitudesRouter.post("/minilote", validarSolicitudMinilote, SolicitudesControlador.crearSolicitudMinilote);

solicitudesRouter.get("/sublote-form", SolicitudesControlador.vistaFormularioSolicitarSublote);

solicitudesRouter.get("/sublote", SolicitudesControlador.listarSolicitudesSublote);

solicitudesRouter.get("/minilote", SolicitudesControlador.listarSolicitudesMinilote);

solicitudesRouter.get("/sublote-listado", SolicitudesControlador.vistaListadoSolicitarSublote);

solicitudesRouter.get("/vacunas-listado", SolicitudesControlador.vistaListadoSolicitarMinilote);

solicitudesRouter.get("/vacuna-form", SolicitudesControlador.vistaFormularioSolicitarMinilote);


export default solicitudesRouter;