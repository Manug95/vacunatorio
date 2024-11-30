import { Router } from "express";
import PersonalControlador from "../controladores/personalControlador.js";
import { validarNuevoPersonal } from "../middlewares/validaciones.js";
import { validarPermisos } from "../middlewares/autorizaciones.js";

const personalRouter = Router();

personalRouter.post("/", validarPermisos, validarNuevoPersonal, PersonalControlador.crear);


export default personalRouter;