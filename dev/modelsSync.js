import pc from "picocolors";
import { sequelize } from "../sequelize.js";

import { DistribucionProvincial } from "../src/modelos/DistribucionProvincial.js";
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
import { Usuario } from "../src/modelos/Usuario.js";
import { Vacunacion } from "../src/modelos/Vacunacion.js";
import { SolicitudSublote } from "../src/modelos/SolicitudSublote.js";
import { SolicitudMinilote } from "../src/modelos/relaciones.js";
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
  try {
    console.log(pc.blue("INICIO SINCRONIZACION MODELOS"));
    await pruebaSyncModelos();
    console.log(pc.green("FIN SINCRONIZACION MODELOS"));

    console.log(pc.blue("INICIO SINCRONIZACION RELACIONES"));
    await pruebaSyncRelaciones();
    console.log(pc.green("FIN SINCRONIZACION RELACIONES"));

    // console.log(pc.blue("INICIO DE CREAR LA RESTRICCION EN LA TABLA VACUNAS"));
    // await sequelize.query('ALTER TABLE vacunas ADD CONSTRAINT vacuna_unica UNIQUE (nombreComercial, laboratorioId, tipoVacunaId);');
    // console.log(pc.green("CONSTRAINTS DE LA TABLA VACUNAS AGREGADAS CON EXITO"));
  } catch (e) {
    console.log(pc.red(e.message));
    throw new Error("Error en pruebaSync");
  }
}

async function pruebaSyncModelos() {
  try {
    await Pais.sync();
    await Provincia.sync();
    await Localidad.sync();
    await Laboratorio.sync();
    await DepositoNacional.sync();
    await TipoVacuna.sync();
    await Vacuna.sync();
    await Personal.sync();
    await Descarte.sync();
    await Lote.sync();
    await SubLote.sync();
    await MiniLote.sync();
    await CentroVacunacion.sync();
    await DistribucionProvincial.sync();
    await Paciente.sync();
    await Vacunacion.sync();
    await Usuario.sync();
    await SolicitudSublote.sync();
    await SolicitudMinilote.sync();
  } catch(err) {
    console.log(pc.red(err.parent.sqlMessage));
    console.log(pc.red(err.parent.sql));
    console.error(err);
    throw new Error("ERROR AL SINCRONIZAR LOS MODELOS");
  }
}

async function pruebaSyncRelaciones() {
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
    await modelos.Vacunacion.sync({alter:true});
    await modelos.DepositoNacional.sync({alter:true});
    await modelos.CentroVacunacion.sync({alter:true});
    await modelos.DistribucionProvincial.sync({alter:true});
    await modelos.Descarte.sync({alter:true});
    await modelos.Usuario.sync({alter:true});
    await modelos.SolicitudSublote.sync({alter:true});
    await modelos.SolicitudMinilote.sync({alter:true});
  } catch(err) {
    console.log(pc.red(err.parent.sqlMessage));
    console.log(pc.red(err.parent.sql));
    console.error(err);
    throw new Error("ERROR AL SINCRONIZAR LAS RELACIONES");
  }
}