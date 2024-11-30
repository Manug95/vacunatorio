import { Router } from "express";
import SolicitudesControlador from "../controladores/solicitudesControlador.js";
import { validarSolicitudSublote, validarSolicitudMinilote } from "../middlewares/validaciones.js";
import { validarPermisos } from "../middlewares/autorizaciones.js";

const solicitudesRouter = Router();

solicitudesRouter.post("/sublote", validarPermisos, validarSolicitudSublote, SolicitudesControlador.crearSolicitudSublote);

solicitudesRouter.post("/minilote", validarPermisos, validarSolicitudMinilote, SolicitudesControlador.crearSolicitudMinilote);

solicitudesRouter.get("/sublote-form", validarPermisos, SolicitudesControlador.vistaFormularioSolicitarSublote);

solicitudesRouter.get("/sublote", validarPermisos, SolicitudesControlador.listarSolicitudesSublote);

solicitudesRouter.get("/minilote", validarPermisos, SolicitudesControlador.listarSolicitudesMinilote);

solicitudesRouter.get("/sublote-listado", validarPermisos, SolicitudesControlador.vistaListadoSolicitarSublote);

solicitudesRouter.get("/vacunas-listado", validarPermisos, SolicitudesControlador.vistaListadoSolicitarMinilote);

solicitudesRouter.get("/vacuna-form", validarPermisos, SolicitudesControlador.vistaFormularioSolicitarMinilote);


export default solicitudesRouter;