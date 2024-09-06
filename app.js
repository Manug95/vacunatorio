import express from "express";

import { loteRouter } from "./src/rutas/loteRouter.js";

const app = express();

app.disable('x-powered-by');
app.use(express.static("public"));
app.use(express.json());

app.use("/lotes", loteRouter);


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