import express from "express";
import pug from "pug";

import loteRouter from "./src/rutas/loteRouter.js";
import subloteRouter from "./src/rutas/subloteRouter.js"
import miniloteRouter from "./src/rutas/miniloteRouter.js";
import personalRouter from "./src/rutas/personalRouter.js";
import pacienteRouter from "./src/rutas/pacienteRouter.js";
import vacunacionRouter from "./src/rutas/vacunacionRouter.js";
import solicitudesRouter from "./src/rutas/solicitudesRouter.js";
import consultasRouter from "./src/rutas/consultasRouter.js";

const app = express();

app.disable('x-powered-by');
app.use(express.static("public"));
app.use(express.json());

app.use("/lotes", loteRouter);
app.use("/sublotes", subloteRouter);
app.use("/minilotes", miniloteRouter);
app.use("/personal", personalRouter);
app.use("/pacientes", pacienteRouter);
app.use("/vacunacion", vacunacionRouter);
app.use("/solicitudes", solicitudesRouter);
app.use("/consultas", consultasRouter);


app.get("/", (req, res) => {
  if (req.url.includes("favicon.ico")) {
    res.end();
  }

  res.send(pug.renderFile("src/vistas/index.pug", {
    pretty: true,
    activeLink: { "home": "active-link" },
    estilos: "styles.css",
  }));
});

app.get("*", (req, res) => {
  if (req.url.includes("favicon.ico")) {
    res.end();
  }
});

// app.get("/", (req, res) => {
//   if (req.url.includes("favicon.ico")) {
//     res.end();
//   }

//   res.send(pug.renderFile("src/vistas/index.pug", {
//     pretty: true,
//     activeLink: "home",
//     estilos: "styles.css",
//   }));
// });

export { app };