import pug from "pug";

export const funcionVistaNotFound = pug.compileFile("src/vistas/notFound.pug");
export const funcionVistaForbbiden = pug.compileFile("src/vistas/forbidden.pug");

export const notFound = (req, res) => {
  res.status(404).send(funcionVistaNotFound());
}