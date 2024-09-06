import { app } from "./app.js";
import { sequelize } from "./sequelize.js";
import { llenarBD } from "./dev/paLlenar.js";
import { pruebaSync } from "./dev/modelsSync.js";
import pc from "picocolors";


const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(pc.green(`Servidor corriendo en http://localhost:${PORT}...`));

  // pruebaSync()
  // .then(() => {

    // console.log(pc.blue("COMIENZO DEL LLENADO DE LA BD"));
    // llenarBD()
    // .then(() => { 
    //   console.log(pc.green("INSERCIONES EN LA BD REALIZADAS CON EXITO"));

      // sequelize.query('ALTER TABLE vacunas ADD CONSTRAINT vacuna_unica UNIQUE (nombreComercial, laboratorioId, tipoVacunaId);')
      // .then(()=>{ console.log(pc.green("CONSTRAINTS DE LA TABLA VACUNAS AGREGADAS CON EXITO")); })
      // .catch(()=>{ console.log(pc.red("ERROR AL AGRAGAR LAS CONSTRAINTS DE LA TABLA VACUNAS")); });
    // })
    // .catch((e) => { 
    //   console.log(pc.red("ERROR AL REALIZAR LAS INSERCIONES EN LA BD"));
    //   console.error(e);
    // });

  // })
  // .catch((e) => { 
  //   console.log(pc.red("ERROR AL SINCRONIZAR LOS MODELOS EN INDEX.JS"));
  //   console.error(e);
  // });

});
