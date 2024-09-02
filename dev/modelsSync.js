import pc from "picocolors";

import { DistribucionProvincial } from "../src/modelos/DistribucionProvincial.js";
import { Almacena } from "../src/modelos/Almacena.js";
import { Pais } from "../src/modelos/Pais.js";
import { DepositoNacional } from "../src/modelos/DepositoNacional.js";
import { Laboratorio } from "../src/modelos/Laboratorio.js";
import { Lote } from "../src/modelos/Lote.js";
import { SubLote } from "../src/modelos/SubLote.js";
import { MiniLote } from "../src/modelos/MiniLote.js";
import { TipoVacuna } from "../src/modelos/TipoVacuna.js";
import { Vacuna } from "../src/modelos/Vacuna.js";
import { Provincia } from "../src/modelos/Provincia.js";
import { Localidad } from "../src/modelos/Localidad.js";
import { CentroVacunacion } from "../src/modelos/CentroVacunacion.js";
import { Personal } from "../src/modelos/Personal.js";
import { Paciente } from "../src/modelos/Paciente.js";
import { Descarte } from "../src/modelos/Descarte.js";
import { Enfermero } from "../src/modelos/Enfermero.js";
import { Vacunacion } from "../src/modelos/Vacunacion.js";
import * as modelos from "../src/modelos/relaciones.js";

export async function pruebaBD() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
} 

export async function pruebaSync() {
  await pruebaSyncModelos();
  await pruebaSyncRelaciones();
}

export async function pruebaSyncModelos() {
  console.log(pc.blue("INICIO SINCRONIZACION MODELOS"));

  try {
    await Pais.sync();
    await Provincia.sync();
    await Localidad.sync();
    await Laboratorio.sync();
    await TipoVacuna.sync();
    await Vacuna.sync();
    await Lote.sync();
    await SubLote.sync();
    await MiniLote.sync();
    await DepositoNacional.sync();
    await Almacena.sync();
    await CentroVacunacion.sync();
    await DistribucionProvincial.sync();
    await Personal.sync();
    await Paciente.sync();
    await Descarte.sync();
    await Enfermero.sync();
    await Vacunacion.sync();

    console.log(pc.green("FIN SINCRONIZACION MODELOS"));
  } catch(err) {
    console.error(pc.red("ERROR AL SINCRONIZAR LOS MODELOS"));
    console.error(pc.red(err.parent.sqlMessage));
    console.log(pc.red(err.parent.sql));
    // console.error(err);
  }
}

export async function pruebaSyncRelaciones() {
  console.log(pc.blue("INICIO SINCRONIZACION RELACIONES"));

  try {
    await modelos.Pais.sync({alter:true});
    await modelos.Provincia.sync({alter:true});
    await modelos.Localidad.sync({alter: true});
    await modelos.Laboratorio.sync({alter:true});
    await modelos.TipoVacuna.sync({alter:true});
    await modelos.Vacuna.sync({alter:true});
    await modelos.Lote.sync({alter:true});
    await modelos.SubLote.sync({alter:true});
    await modelos.MiniLote.sync({alter:true});
    await modelos.Paciente.sync({alter:true});
    await modelos.Personal.sync({alter:true});
    await modelos.Enfermero.sync({alter:true});
    await modelos.Vacunacion.sync({alter:true});
    await modelos.DepositoNacional.sync({alter:true});
    await modelos.Almacena.sync({alter:true});
    await modelos.CentroVacunacion.sync({alter:true});
    await modelos.DistribucionProvincial.sync({alter:true});
    await modelos.Descarte.sync({alter:true});

    console.log(pc.green("FIN SINCRONIZACION RELACIONES"));
  } catch(err) {
    console.error(pc.red("ERROR AL SINCRONIZAR LAS RELACIONES"));
    console.error(pc.red(err.parent.sqlMessage));
    console.log(pc.red(err.parent.sql));
    // console.error(err);
  }
}