import { Router } from "express";
import ConsultasControlador from "../controladores/consultasControlador.js";
import { validarPermisos, validarPermisosRutasDinamicas } from "../middlewares/autorizaciones.js";

const consultasRouter = Router();

consultasRouter.get("/", validarPermisos, ConsultasControlador.vistaConsultas);

consultasRouter.get("/:consulta", validarPermisosRutasDinamicas('ADMIN_NAC', 'ADMIN_PROV', 'ADMIN_CEN', 'MASTER'), ConsultasControlador.antenderConsulta);


export default consultasRouter;