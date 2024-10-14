import { Router } from "express";
import PersonalControlador from "../controladores/personalControlador.js";
import { validarNuevoPersonal } from "../middlewares/validaciones.js";

const personalRouter = Router();

personalRouter.post("/", validarNuevoPersonal, PersonalControlador.crear);


export default personalRouter;