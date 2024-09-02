import { sequelize } from "../sequelize.js";
import { Op } from "sequelize";
import { faker } from '@faker-js/faker';
import * as modelos from "../src/modelos/relaciones.js";
import Utils from "../utils.js";

export async function llenarBD() {
  try {
    await llenarPaises();
    await llenarProvincias();
    await llenarLocalidades();
    await llenarLaboratorios();
    await llenarTiposVacunas();
    await llenarVacunas();
    await llenarLotes();
    await llenarDepositoNacional();
    await llenarCentrosVacunacion();
    // await llenarAlmacen();
    await llenarEnfermeros();
    await llenarPersonal();
  } catch (err) {
    console.error(err);
  }
}

async function llenarPaises() {
  await modelos.Pais.bulkCreate([
    { nombre: "USA" },
    { nombre: "Alemania" },
    { nombre: "Japon" },
    { nombre: "Rusia" },
    { nombre: "Inglaterra" }
  ]);
}

async function llenarLaboratorios() {
  await modelos.Laboratorio.bulkCreate([
    { nombre: "El Bayern", pais: 2},
    { nombre: "Laboratorio Yankee", pais: 1 },
    { nombre: "Laboratorio Ponja", pais: 3 },
    { nombre: "Laboratorio Ruso", pais: 4 },
    { nombre: "Laboratorio Ingles", pais: 5 }
  ]);
}

async function llenarTiposVacunas() {
  await modelos.TipoVacuna.bulkCreate([
    { tipo: "BCG" },
    { tipo: "Atitetanica" },
    { tipo: "SABIN" },
    { tipo: "Antisarampionosa" },
    { tipo: "MMR" },
    { tipo: "Triple Viral" }
  ]);
}

async function llenarVacunas() {
  await modelos.Vacuna.bulkCreate([
    { nombreComercial: "BCGarda", laboratorio_id: 1, tipoVacuna_id: 1 },
    { nombreComercial: "AntiTet", laboratorio_id: 2, tipoVacuna_id: 2 },
    { nombreComercial: "SABINarda", laboratorio_id: 3, tipoVacuna_id: 3 },
    { nombreComercial: "Sin Sarampion", laboratorio_id: 4, tipoVacuna_id: 4 },
    { nombreComercial: "MMR pro", laboratorio_id: 5, tipoVacuna_id: 5 },
    { nombreComercial: "Triplarda", laboratorio_id: 5, tipoVacuna_id: 6 },
    { nombreComercial: "BCgita", laboratorio_id: 2, tipoVacuna_id: 1 },
    { nombreComercial: "Sin Tetanos", laboratorio_id: 3, tipoVacuna_id: 2 },
    { nombreComercial: "Chau Sarampion", laboratorio_id: 3, tipoVacuna_id: 4 },
    { nombreComercial: "The Treble", laboratorio_id: 2, tipoVacuna_id: 6 },
  ]);
}

async function llenarProvincias() {
  await modelos.Provincia.bulkCreate([
    { nombre: "Buenos Aires" },
    { nombre: "Santa Fé" },
    { nombre: "Entre Ríos" },
    { nombre: "Corrientes" },
    { nombre: "Misiones" },
    { nombre: "Formosa" },
    { nombre: "Chaco" },
    { nombre: "Santiago del Estero" },
    { nombre: "Tucumán" },
    { nombre: "Córdoba" },
    { nombre: "San Luís" },
    { nombre: "La Pampa" },
    { nombre: "Mendoza" },
    { nombre: "San Juan" },
    { nombre: "La Rioja" },
    { nombre: "Catamarca" },
    { nombre: "Salta" },
    { nombre: "Jujuy" },
    { nombre: "Neuquén" },
    { nombre: "Río Negro" },
    { nombre: "Chubut" },
    { nombre: "Santa Cruz" },
    { nombre: "Tierra del Fuego" },
  ]);
}

async function llenarLocalidades() {
  await modelos.Localidad.bulkCreate([
    { nombre: "localidad 1", provincia: 1 },
    { nombre: "localidad 2", provincia: 2 },
    { nombre: "localidad 3", provincia: 3 },
    { nombre: "localidad 4", provincia: 4 },
    { nombre: "localidad 5", provincia: 5 },
    { nombre: "localidad 6", provincia: 1 },
    { nombre: "localidad 7", provincia: 2 },
    { nombre: "localidad 8", provincia: 3 },
    { nombre: "localidad 9", provincia: 1 },
    { nombre: "localidad 10", provincia: 1 },
    // { nombre: "San Luís" },
    // { nombre: "La Pampa" },
    // { nombre: "Mendoza" },
    // { nombre: "San Juan" },
    // { nombre: "La Rioja" },
    // { nombre: "Catamarca" },
    // { nombre: "Salta" },
    // { nombre: "Jujuy" },
    // { nombre: "Neuquén" },
    // { nombre: "Río Negro" },
    // { nombre: "Chubut" },
    // { nombre: "Santa Cruz" },
    // { nombre: "Tierra del Fuego" },
  ]);
}

async function llenarDepositoNacional() {
  await modelos.DepositoNacional.bulkCreate([
    { nombre: "Deposito Nacional A" },
    { nombre: "Deposito Nacional B" },
    { nombre: "Deposito Nacional C" }
  ]);
}

async function llenarCentrosVacunacion() {
  await modelos.CentroVacunacion.bulkCreate([
    { nombre: "Centro Vacunacion A", ciudad: 1 },
    { nombre: "Centro Vacunacion B", ciudad: 2 },
    { nombre: "Centro Vacunacion C", ciudad: 3 },
    { nombre: "Centro Vacunacion D", ciudad: 4 },
    { nombre: "Centro Vacunacion E", ciudad: 5 }
  ]);
}

async function llenarLotes() {
  const lotes = [
    {
      // fechaCompra: new Date(2024,1,10),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 10000,
      vacuna_id: 2
    },
    {
      // fechaCompra: new Date(2024, 1, 15),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 5000,
      vacuna_id: 1
    },
    {
      // fechaCompra: new Date(2024 ,1, 20),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 1000,
      vacuna_id: 5
    },
    {
      // fechaCompra: new Date(2024, 1, 18),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 3500,
      vacuna_id: 4
    },
    {
      // fechaCompra: new Date(2024, 5, 18),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 1000,
      vacuna_id: 3
    }
  ].map((lote, i) => {
    lote.nroLote = Utils.crearNroLote(i);
    return lote;
  });

  await modelos.Lote.bulkCreate(lotes);
}

async function llenarAlmacen() {
  await modelos.Almacena.bulkCreate([
    {
      lote: 1,
      deposito: 1
    },
    {
      lote: 2,
      deposito: 1
    },
    {
      lote: 3,
      deposito: 1
    },
    {
      lote: 4,
      deposito: 1
    },
    {
      lote: 5,
      deposito: 1
    }
  ]);
}

async function llenarPersonal() {
  await modelos.Personal.bulkCreate([
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ADMINISTRATIVO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ADMINISTRATIVO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ADMINISTRATIVO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ADMINISTRATIVO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ADMINISTRATIVO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "LOGISTICA" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "LOGISTICA" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "LOGISTICA" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "LOGISTICA" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "LOGISTICA" 
    },
  ]);
}

async function llenarEnfermeros() {
  await modelos.Enfermero.bulkCreate([
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      licencia: "A"
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      licencia: "B"
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      licencia: "C"
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      licencia: "A"
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      licencia: "B"
    },
  ]);
}

