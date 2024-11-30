export const PERMISOS = new Map([
  [
    "/usuarios/register", 
    ['ADMIN_NAC', 'MASTER']
  ],
  [
    "/usuarios/create", 
    ['ADMIN_NAC', 'MASTER']
  ],
  [
    "/lotes", 
    ['ADMIN_NAC', 'MASTER']
  ],
  [
    "/lotes/comprar", 
    ['ADMIN_NAC', 'MASTER']
  ],
  [
    "/lotes/listado", 
    ['ADMIN_NAC', 'LOGIST_NAC', 'MASTER']
  ],
  [
    "/lotes/descartar", 
    ['ADMIN_NAC', 'LOGIST_NAC', 'MASTER']
  ],
  [
    "/sublotes", 
    ['ADMIN_PROV', 'MASTER']
  ],
  [
    "/sublotes/crear", 
    ['ADMIN_PROV', 'MASTER']
  ],
  [
    "/sublotes/listado", 
    ['ADMIN_PROV', 'LOGIST_PROV', 'MASTER']
  ],
  [
    "/sublotes/descartar", 
    ['ADMIN_PROV', 'LOGIST_PROV', 'MASTER']
  ],
  [
    "/minilotes", 
    ['ADMIN_CEN', 'MASTER']
  ],
  [
    "/minilotes/crear", 
    ['ADMIN_CEN', 'MASTER']
  ],
  [
    "/minilotes/listado", 
    ['ADMIN_CEN', 'LOGIST_CEN', 'MASTER']
  ],
  [
    "/minilotes/descartar", 
    ['ADMIN_CEN', 'LOGIST_CEN', 'MASTER']
  ],
  [
    "/minilotes/redistribuir", 
    ['ADMIN_CEN', 'LOGIST_CEN', 'MASTER']
  ],
  [
    "/minilotes/distribucion", 
    ['ADMIN_CEN', 'LOGIST_CEN', 'MASTER']
  ],
  [
    "/personal", 
    ['ADMIN_NAC', 'MASTER']
  ],
  [
    "/pacientes", 
    ['ADMIN_CEN', 'MASTER']
  ],
  [
    "/pacientes/registrar", 
    ['ADMIN_CEN', 'MASTER']
  ],
  [
    "/vacunacion", 
    ['ADMIN_CEN', 'ENFERMERO', 'MASTER']
  ],
  [
    "/solicitudes/sublote", 
    ['ADMIN_NAC', 'LOGIST_NAC', 'MASTER']
  ],
  [
    "/solicitudes/minilote", 
    ['ADMIN_PROV', 'LOGIST_PROV', 'MASTER']
  ],
  [
    "/solicitudes/sublote-form", 
    ['ADMIN_NAC', 'LOGIST_NAC', 'MASTER']
  ],
  [
    "/solicitudes/sublote-listado", 
    ['ADMIN_NAC', 'LOGIST_NAC', 'MASTER']
  ],
  [
    "/solicitudes/vacunas-listado", 
    ['ADMIN_PROV', 'LOGIST_PROV', 'MASTER']
  ],
  [
    "/solicitudes/vacuna-form", 
    ['ADMIN_PROV', 'LOGIST_PROV', 'MASTER']
  ],
  [
    "/consultas", 
    ['ADMIN_NAC', 'ADMIN_PROV', 'ADMIN_CEN', 'MASTER']
  ]
]);