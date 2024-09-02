import express from "express";
// import pug from "pug";
// const path = require('node:path');

const app = express();

app.disable('x-powered-by');
app.use(express.static("public"));
app.use(express.json());


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