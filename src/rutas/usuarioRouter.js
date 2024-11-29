import { Router } from "express";
import UsuarioControlador from "../controladores/usuarioControlador.js";
import { validarNuevoUsuario, validarUsuario } from "../middlewares/validaciones.js";

const usuarioRouter = Router();

usuarioRouter.get("/login", UsuarioControlador.vistaLogin);

usuarioRouter.get("/register", UsuarioControlador.vistaRegistro);

usuarioRouter.post("/logout", UsuarioControlador.logout);

usuarioRouter.post("/create", validarNuevoUsuario, UsuarioControlador.crear);

usuarioRouter.post("/authenticate", validarUsuario, UsuarioControlador.login);


export default usuarioRouter;