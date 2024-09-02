import { Laboratorio } from "./Laboratorio.js";
import { Pais } from "./Pais.js";
import { Almacena } from "./Almacena.js";
import { Lote } from "./Lote.js";
import { SubLote } from "./SubLote.js";
import { MiniLote } from "./MiniLote.js";
import { TipoVacuna } from "./TipoVacuna.js";
import { Vacuna } from "./Vacuna.js";
import { DepositoNacional } from "./DepositoNacional.js";
import { Provincia } from "./Provincia.js";
import { Localidad } from "./Localidad.js";
import { CentroVacunacion } from "./CentroVacunacion.js";
import { Personal } from "./Personal.js";
import { Descarte } from "./Descarte.js";
import { DistribucionProvincial } from "./DistribucionProvincial.js";
import { Paciente } from "./Paciente.js";
import { Vacunacion } from "./Vacunacion.js";
import { Enfermero } from "./Enfermero.js";

//Laboratorio-Pais
Pais.hasMany(Laboratorio, {foreignKey: "pais_id"});
Laboratorio.belongsTo(Pais, {foreignKey: "pais_id"});

//Vacuna-Laboratorio
Laboratorio.hasMany(Vacuna, { foreignKey: "laboratorio_id" });
Vacuna.belongsTo(Laboratorio, { foreignKey: "laboratorio_id" });

//Vacuna-TipoVacuna
TipoVacuna.hasMany(Vacuna, {foreignKey: "tipoVacuna_id"});
Vacuna.belongsTo(TipoVacuna, {foreignKey: "tipoVacuna_id"});

//Localidad-Provincia
Provincia.hasMany(Localidad, {foreignKey: "provincia"});
Localidad.belongsTo(Provincia, {foreignKey: "provincia"});

//Lote-Vacuna
Vacuna.hasMany(Lote, { foreignKey: "vacuna_id" });
Lote.belongsTo(Vacuna, { foreignKey: "vacuna_id" });

//SubLote-Lote
Lote.hasMany(SubLote, { foreignKey: "lote" });
SubLote.belongsTo(Lote, { foreignKey: "lote" });

//Lote-DepositoNacional por table Almacena
Lote.belongsToMany(DepositoNacional, { through: Almacena, foreignKey: "lote" });
DepositoNacional.belongsToMany(Lote, { through: Almacena, foreignKey: "deposito" });
Lote.hasMany(Almacena, { foreignKey: "lote" });
Almacena.belongsTo(Lote, { foreignKey: "lote" });
DepositoNacional.hasMany(Almacena, { foreignKey: "deposito" });
Almacena.belongsTo(DepositoNacional, { foreignKey: "deposito" });

//Provincia-SubLote
Provincia.hasMany(SubLote, {foreignKey: "provincia"});
SubLote.belongsTo(Provincia, {foreignKey: "provincia"});

//MiniLote-SubLote
SubLote.hasMany(MiniLote, { foreignKey: "sublote" });
MiniLote.belongsTo(SubLote, { foreignKey: "sublote" });

//Localidad-CentroVacunacion
Localidad.hasMany(CentroVacunacion, {foreignKey: "localidad"});
CentroVacunacion.belongsTo(Localidad, {foreignKey: "localidad"});

//relacion super many to many entre MiniLote-CentroVacunacion-DistribucionProvincial
MiniLote.belongsToMany(CentroVacunacion, { through: DistribucionProvincial, foreignKey: "minilote" });
CentroVacunacion.belongsToMany(MiniLote, { through: DistribucionProvincial, foreignKey: "centro" });
MiniLote.hasMany(DistribucionProvincial, { foreignKey: "minilote" });
DistribucionProvincial.belongsTo(MiniLote, { foreignKey: "minilote" });
CentroVacunacion.hasMany(DistribucionProvincial, { foreignKey: "centro" });
DistribucionProvincial.belongsTo(CentroVacunacion, { foreignKey: "centro" });

//Descarte-Personal
Personal.hasMany(Descarte);
Descarte.belongsTo(Personal);

//Vacunacion-Enfermero-Paciente-MiniLote
Enfermero.hasMany(Vacunacion, { foreignKey: "enfermero" });
Vacunacion.belongsTo(Enfermero, { foreignKey: "enfermero" });
Paciente.hasMany(Vacunacion, { foreignKey: "paciente" });
Vacunacion.belongsTo(Paciente, { foreignKey: "paciente" });
MiniLote.hasMany(Vacunacion, { foreignKey: "minilote" });
Vacunacion.belongsTo(MiniLote, { foreignKey: "minilote" });


export {
  Pais,
  Laboratorio,
  Lote,
  SubLote,
  MiniLote,
  TipoVacuna,
  Vacuna,
  DepositoNacional,
  Almacena,
  Provincia,
  Localidad,
  CentroVacunacion,
  Personal,
  Descarte,
  DistribucionProvincial,
  Paciente,
  Vacunacion,
  Enfermero
};