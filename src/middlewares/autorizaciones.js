import { PERMISOS } from "./config.permisos.js";
import { funcionVistaForbbiden } from "./errores400.js";

export function validarPermisos(req, res, next) {
  next();
  // const { rol } = req.userData;
  // const ruta = PERMISOS.get(req.originalUrl);

  // if (ruta && ruta.includes(rol)) {
  //   next();
  // } else {
  //   if (req.accepts("html")) {
  //     devolverVistaForbidden(res);
  //   }
  //   if (req.accepts("json")) {
  //     return res.status(403).json({ ok: false, mensaje: "Sin permisos" });
  //   }
  // }
}

/**
 * 
 * @param  {...any} permisos 'ADMIN_NAC', 'LOGIST_NAC', 'ENFERMERO', 'ADMIN_PROV', 'LOGIST_PROV', 'ADMIN_CEN', 'LOGIST_CEN'
 * @returns {Function}
 */
export function validarPermisosRutasDinamicas(...rolesPermitidos) {
  return (req, res, next) => {
    next();
    // const { rol } = req.userData;
  
    // if (rolesPermitidos.includes(rol)) {
    //   next();
    // } else {
    //   if (req.accepts("html")) {
    //     devolverVistaForbidden(res);
    //   }
    //   if (req.accepts("json")) {
    //     return res.status(403).json({ ok: false, mensaje: "Sin permisos" });
    //   }
    // }
  }
}

function devolverVistaForbidden(res) {
  return res
    .status(403)
    .send(funcionVistaForbbiden())
  ;
}