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
import { Usuario } from "./Usuario.js";

//Laboratorio-Pais
Pais.hasMany(Laboratorio, {foreignKey: "paisId"});
Laboratorio.belongsTo(Pais, {foreignKey: "paisId"});

//Vacuna-Laboratorio
Laboratorio.hasMany(Vacuna, { foreignKey: "laboratorioId" });
Vacuna.belongsTo(Laboratorio, { foreignKey: "laboratorioId" });

//Vacuna-TipoVacuna
TipoVacuna.hasMany(Vacuna, {foreignKey: "tipoVacunaId"});
Vacuna.belongsTo(TipoVacuna, {foreignKey: "tipoVacunaId"});

//Localidad-Provincia
Provincia.hasMany(Localidad, {foreignKey: "provinciaId"});
Localidad.belongsTo(Provincia, {foreignKey: "provinciaId"});

//Lote-Vacuna
Vacuna.hasMany(Lote, { foreignKey: "vacunaId" });
Lote.belongsTo(Vacuna, { foreignKey: "vacunaId" });

//SubLote-Lote
Lote.hasMany(SubLote, { foreignKey: "loteId" });
SubLote.belongsTo(Lote, { foreignKey: "loteId" });

//Lote-DepositoNacional por table Almacena
Lote.belongsToMany(DepositoNacional, { through: Almacena, foreignKey: "loteId" });
DepositoNacional.belongsToMany(Lote, { through: Almacena, foreignKey: "depositoId" });
Lote.hasMany(Almacena, { foreignKey: "loteId" });
Almacena.belongsTo(Lote, { foreignKey: "loteId" });
DepositoNacional.hasMany(Almacena, { foreignKey: "depositoId" });
Almacena.belongsTo(DepositoNacional, { foreignKey: "depositoId" });

//Provincia-SubLote
Provincia.hasMany(SubLote, {foreignKey: "provinciaId"});
SubLote.belongsTo(Provincia, {foreignKey: "provinciaId"});

//MiniLote-SubLote
SubLote.hasMany(MiniLote, { foreignKey: "subloteId" });
MiniLote.belongsTo(SubLote, { foreignKey: "subloteId" });

//Localidad-CentroVacunacion
Localidad.hasMany(CentroVacunacion, {foreignKey: "localidadId"});
CentroVacunacion.belongsTo(Localidad, {foreignKey: "localidadId"});

//relacion super many to many entre MiniLote-CentroVacunacion-DistribucionProvincial
MiniLote.belongsToMany(CentroVacunacion, { through: DistribucionProvincial, foreignKey: "miniloteId" });
CentroVacunacion.belongsToMany(MiniLote, { through: DistribucionProvincial, foreignKey: "centroId" });
MiniLote.hasMany(DistribucionProvincial, { foreignKey: "miniloteId" });
DistribucionProvincial.belongsTo(MiniLote, { foreignKey: "miniloteId" });
CentroVacunacion.hasMany(DistribucionProvincial, { foreignKey: "centroId" });
DistribucionProvincial.belongsTo(CentroVacunacion, { foreignKey: "centroId" });

//Descarte-Personal
Personal.hasMany(Descarte);
Descarte.belongsTo(Personal);

//Vacunacion-Enfermero-Paciente-MiniLote
Personal.hasMany(Vacunacion, { foreignKey: "enfermeroId" });
Vacunacion.belongsTo(Personal, { foreignKey: "enfermeroId" });
Paciente.hasMany(Vacunacion, { foreignKey: "pacienteId" });
Vacunacion.belongsTo(Paciente, { foreignKey: "pacienteId" });
MiniLote.hasMany(Vacunacion, { foreignKey: "miniloteId" });
Vacunacion.belongsTo(MiniLote, { foreignKey: "miniloteId" });

//Usuario-Personal
Personal.hasOne(Usuario, { foreignKey: "personalId" });
Usuario.belongsTo(Personal, { foreignKey: "personalId" });


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
  Usuario
};