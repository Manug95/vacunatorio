import express from "express";
import pug from "pug";
import cookieParser from "cookie-parser";

import loteRouter from "./src/rutas/loteRouter.js";
import subloteRouter from "./src/rutas/subloteRouter.js"
import miniloteRouter from "./src/rutas/miniloteRouter.js";
import personalRouter from "./src/rutas/personalRouter.js";
import pacienteRouter from "./src/rutas/pacienteRouter.js";
import vacunacionRouter from "./src/rutas/vacunacionRouter.js";
import solicitudesRouter from "./src/rutas/solicitudesRouter.js";
import consultasRouter from "./src/rutas/consultasRouter.js";
import usuarioRouter from "./src/rutas/usuarioRouter.js";

import UsuarioControlador from "./src/controladores/usuarioControlador.js";

import { autenticarUsuario } from "./src/middlewares/autenticaciones.js";
import { validarLogin } from "./src/middlewares/validaciones.js";
import { notFound, funcionVistaNotFound } from "./src/middlewares/errores400.js";

const app = express();
app.disable('x-powered-by');

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.originalUrl.includes("favicon.ico")) res.end();
  next();
});

app.use((req, res, next) => { req.userData = { isLogged: true, rol: 'MASTER' }; next(); });
app.get("/", (req, res) => {
  res.send(pug.renderFile("src/vistas/index.pug", {
    activeLink: { "home": "active-link" },
    tabTitle: "Home",
    isLogged: req.userData.isLogged,
    rol: req.userData.rol
    // estilos: "styles.css",
  }));
});

app.get("/login", UsuarioControlador.vistaLogin);
app.post("/login", validarLogin, UsuarioControlador.login);

// app.use(autenticarUsuario);

app.use("/usuarios", usuarioRouter);
app.use("/lotes", loteRouter);
app.use("/sublotes", subloteRouter);
app.use("/minilotes", miniloteRouter);
app.use("/personal", personalRouter);
app.use("/pacientes", pacienteRouter);
app.use("/vacunacion", vacunacionRouter);
app.use("/solicitudes", solicitudesRouter);
app.use("/consultas", consultasRouter);

// app.get("*", notFound);
app.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).send(funcionVistaNotFound());
  }

  if (req.accepts("application/json")) {
    return res.status(404).json({ ok: false, mensaje: "Not Found" });
  }

  return res.end();
});

export { app };