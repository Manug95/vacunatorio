import { Router } from "express";
import UsuarioControlador from "../controladores/usuarioControlador.js";
import { validarNuevoUsuario } from "../middlewares/validaciones.js";
import { validarPermisos } from "../middlewares/autorizaciones.js";

const usuarioRouter = Router();

// usuarioRouter.get("/login", UsuarioControlador.vistaLogin);

usuarioRouter.get("/register", validarPermisos, UsuarioControlador.vistaRegistro);

usuarioRouter.post("/logout", validarPermisos, UsuarioControlador.logout);

usuarioRouter.post("/create", validarPermisos, validarNuevoUsuario, UsuarioControlador.crear);

// usuarioRouter.post("/authenticate", validarUsuario, UsuarioControlador.login);


export default usuarioRouter;