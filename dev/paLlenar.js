import { sequelize } from "../sequelize.js";
import { Op } from "sequelize";
import { faker } from '@faker-js/faker';
import * as modelos from "../src/modelos/relaciones.js";
import Utils from "../utils.js";
import loteServicio from "../src/servicios/loteServicio.js";

export async function llenarBD() {
  try {
    // await llenarPaises();
    // await llenarProvincias();
    // await llenarLocalidades();
    // await llenarLaboratorios();
    // await llenarTiposVacunas();
    // await llenarVacunas();
    // await llenarLotes();
    // await llenarDepositoNacional();
    // await llenarCentrosVacunacion();
    // await llenarPersonal();
    await llenarAlmacen();
  } catch (err) {
    console.error(err);
  }
}

export async function probarModelo() {
  const datosModelo = {
    nroLote: "L2024-09-06/01:19:26",
    vencimiento: Date.now(),
    fechaFabricacion: Date.now(),
    vacunaId: 1,
    cantidad: 3
  };

  try {
    const instanciaCreada = await loteServicio.crearLote({vacuna: 1, cantidad: 3});
  } catch (error) {
    // console.error(error);
    console.log(error);
    // console.log(error.errors[0].value);
    //error.name = SequelizeUniqueConstraintError es el tipo de error de sequelize
    //error.errors[0].path es la propieda/column de la bd donde ocurrio el error
    //error.errors[0].value es el valor incorrecto ingresado
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
    { nombre: "El Bayern", paisId: 2},
    { nombre: "Laboratorio Yankee", paisId: 1 },
    { nombre: "Laboratorio Ponja", paisId: 3 },
    { nombre: "Laboratorio Ruso", paisId: 4 },
    { nombre: "Laboratorio Ingles", paisId: 5 }
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
    { nombreComercial: "BCGarda", laboratorioId: 1, tipoVacunaId: 1 },
    { nombreComercial: "AntiTet", laboratorioId: 2, tipoVacunaId: 2 },
    { nombreComercial: "SABINarda", laboratorioId: 3, tipoVacunaId: 3 },
    { nombreComercial: "Sin Sarampion", laboratorioId: 4, tipoVacunaId: 4 },
    { nombreComercial: "MMR pro", laboratorioId: 5, tipoVacunaId: 5 },
    { nombreComercial: "Triplarda", laboratorioId: 5, tipoVacunaId: 6 },
    { nombreComercial: "BCgita", laboratorioId: 2, tipoVacunaId: 1 },
    { nombreComercial: "Sin Tetanos", laboratorioId: 3, tipoVacunaId: 2 },
    { nombreComercial: "Chau Sarampion", laboratorioId: 3, tipoVacunaId: 4 },
    { nombreComercial: "The Treble", laboratorioId: 2, tipoVacunaId: 6 },
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
    { nombre: "localidad 1", provinciaId: 1 },
    { nombre: "localidad 2", provinciaId: 2 },
    { nombre: "localidad 3", provinciaId: 3 },
    { nombre: "localidad 4", provinciaId: 4 },
    { nombre: "localidad 5", provinciaId: 5 },
    { nombre: "localidad 6", provinciaId: 1 },
    { nombre: "localidad 7", provinciaId: 2 },
    { nombre: "localidad 8", provinciaId: 3 },
    { nombre: "localidad 9", provinciaId: 1 },
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
    { nombre: "Centro Vacunacion A", localidadId: 1 },
    { nombre: "Centro Vacunacion B", localidadId: 2 },
    { nombre: "Centro Vacunacion C", localidadId: 3 },
    { nombre: "Centro Vacunacion D", localidadId: 4 },
    { nombre: "Centro Vacunacion E", localidadId: 5 }
  ]);
}

async function llenarLotes() {
  const lotes = [
    {
      // fechaCompra: new Date(2024,1,10),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 10000,
      vacunaId: 2
    },
    {
      // fechaCompra: new Date(2024, 1, 15),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 5000,
      vacunaId: 1
    },
    {
      // fechaCompra: new Date(2024 ,1, 20),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 1000,
      vacunaId: 5
    },
    {
      // fechaCompra: new Date(2024, 1, 18),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 3500,
      vacunaId: 4
    },
    {
      // fechaCompra: new Date(2024, 5, 18),
      fechaFabricacion: new Date(2023, 0, 2),
      vencimiento: new Date(2025, 0, 2),
      cantidad: 1000,
      vacunaId: 3
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
      loteId: "1507860f-14b4-438c-9196-7f546807a53e",
      depositoId: 1
    },
    {
      loteId: "84fefdb0-7ba4-48ec-8a00-1b73a50cf04d",
      depositoId: 1
    },
    {
      loteId: "9ded97b2-1766-4cf6-a2cf-63486cf6e0f2",
      depositoId: 1
    },
    {
      loteId: "a910d974-ab62-46e1-bd5c-0ff439ff1d22",
      depositoId: 1
    },
    {
      loteId: "e35be454-d0d8-438e-9b7e-6f0ab4ccde37",
      depositoId: 1
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
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ENFERMERO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ENFERMERO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ENFERMERO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ENFERMERO" 
    },
    {
      nombres: faker.person.firstName(),
      apellidos: faker.person.lastName(),
      cargo: "ENFERMERO" 
    },
  ]);
}

