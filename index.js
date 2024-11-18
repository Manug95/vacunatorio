import { app } from "./app.js";
import { llenarBD } from "./dev/paLlenar.js";
import { pruebaSync } from "./dev/modelsSync.js";
import pc from "picocolors";


const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(pc.green(`Servidor corriendo en http://localhost:${PORT}...`));

  // pruebaSync()
  // .then(() => { console.log(pc.green("TODO OK")); })
  // .catch((e) => { console.log(pc.red(e.message)); });

  // llenarBD()
  // .then(() => { console.log(pc.green("TODO OK")); })
  // .catch((e) => { console.log(pc.red(e.message)); });

});
