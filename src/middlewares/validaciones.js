import { validarCantidad } from "../../utils.js";

export function validarNuevoLote(req, res, next) {
	const { vacuna, cantidad, deposito } = req.body;

  try {
		if (!vacuna) {
			throw new Error("Es necesario especificar el tipo de vacuna que se quiere");
		}

		if (!deposito) {
			throw new Error("Es necesario especificar el deposito en el que se quiere almacenar el lote");
		}

		// if (cantidad === undefined) { // aca tambien entra si la cantidad es 0(numero)
		// 	throw new Error("Es necesario especificar la cantidad de vacunas que tendrá el lote");
		// }

		validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarNuevoSubLote(req, res, next) {
	// const { lote, provincia, cantidad } = req.body;
	const { tipoVacuna, provincia, cantidad, deposito } = req.body;

  try {
		if (!tipoVacuna) {
			throw new Error("Falta la vacuna");
		}

		if (!provincia) {
			throw new Error("Es necesario especificar la provincia a la que se enviara el sublote");
		}

		if (!deposito) {
			throw new Error("Es necesario especificar el deposito origen");
		}

		validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarDistribucionMiniLote(req, res, next) {
	const { tipoVacuna, cantidad, centro, provincia } = req.body;

  try {
		if (!tipoVacuna) {
      throw new Error("Falta la vacuna");
    }

    if (!centro) {
      throw new Error("Falta el centro de vacunación al que se enviaran las vacunas");
    }

    if (!provincia) {
      throw new Error("Falta la provincia");
    }

    validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarRedistribucionMiniLote(req, res, next) {
  const { distribucion, cantidad, centroDestino } = req.body;

	try {

		if (!centroDestino) {
			throw new Error("Es necesario especificar el centro de vacunación destino al que se enviaran las vacunas");
		}
		
		if (!distribucion) {
			throw new Error("Es necesario especificar la id de la distribucion provincial");
		}

		validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarDescarteLote(req, res, next) {
  const { lote, motivo, formaDescarte, codigo } = req.body;

	try {
		if (!lote) {
			throw new Error("Es necesario especificar el lote que se va a descartar");
		}

		if (!motivo) {
      throw new Error("Falta el motivo del descarte");
    }

    if (!formaDescarte) {
      throw new Error("Falta la forma de descarte");
    }

    if (!codigo) {
      throw new Error("Falta el código");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarDescarteSubLote(req, res, next) {
  const { sublote, motivo, formaDescarte, codigo } = req.body;

	try {
		if (!sublote) {
			throw new Error("Es necesario especificar el sublote que se va a descartar");
		}

		if (!motivo) {
      throw new Error("Falta el motivo del descarte");
    }

    if (!formaDescarte) {
      throw new Error("Falta la forma de descarte");
    }

    if (!codigo) {
      throw new Error("Falta el codigo del empleado");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarDescarteDistribucionProvincial(req, res, next) {
  const { distribucion, motivo, formaDescarte, codigo } = req.body;

	try {
		if (!distribucion) {
			throw new Error("Es necesario especificar la distribucion que se va a descartar");
		}

		if (!motivo) {
      throw new Error("Falta el motivo del descarte");
    }

    if (!formaDescarte) {
      throw new Error("Falta la forma de descarte");
    }

    if (!codigo) {
      throw new Error("Falta el código del empleado");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarNuevoPersonal(req, res, next) {
	const { nombres, apellidos, cargo } = req.body;

	try {
		if (!nombres) {
			throw new Error("Faltan los nombres");
		}

		if (!apellidos) {
      throw new Error("Faltan los apellidos");
    }

    if (!cargo) {
      throw new Error("Falta el cargo");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarNuevoPaciente(req, res, next) {
	const { dni, nombres, apellidos, email, telefono, fechaNac, genero, localidad, provincia } = req.body;

	try {
		if (!nombres) {
			throw new Error("Faltan los nombres");
		}

		if (!apellidos) {
      throw new Error("Faltan los apellidos");
    }

    if (!dni) {
      throw new Error("Falta el DNI");
    }

    if (!email) {
      throw new Error("Falta el email");
    }

    if (!telefono) {
      throw new Error("Falta el teléfono");
    }

    if (!fechaNac) {
      throw new Error("Falta la fecha de nacimiento");
    }

    if (!genero) {
      throw new Error("Falta el genero");
    }

    if (!localidad) {
      throw new Error("Falta la localidad");
    }

    if (!provincia) {
      throw new Error("Falta provincia");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarVacunacion(req, res, next) {
	const { centro, enfermero, vacuna, dni } = req.body;

	try {

		if (!centro) {
      throw new Error("Falta el centro de vacunación");
    }

    if (!enfermero) {
      throw new Error("Falta el/la enfermero/a");
    }

    if (!dni) {
      throw new Error("Falta el DNI");
    }

    if (!vacuna) {
      throw new Error("Falta la vacuna");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarSolicitudSublote(req, res, next) {
	const { tipoVacuna, provincia, cantidad } = req.body;

	try {
		if (!tipoVacuna) {
			throw new Error("Falta el tipo de vacuna");
		}

		if (!provincia) {
      throw new Error("Falta la provincia");
    }

    validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarSolicitudMinilote(req, res, next) {
	const { tipoVacuna, centro, cantidad } = req.body;

	try {
		if (!tipoVacuna) {
			throw new Error("Falta el tipo de vacuna");
		}

		if (!centro) {
      throw new Error("Falta el centro de vacunación");
    }

    validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarNuevoUsuario(req, res, next) {
	const { username, password, rol, personal } = req.body;

	try {
		if (!username) {
			throw new Error("Falta nombre de usuario");
		}

		if (!password) {
      throw new Error("Falta la contraseña");
    }

		if (!rol) {
      throw new Error("Falta el rol");
    }

		if (!personal) {
      throw new Error("Falta el personal");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarLogin(req, res, next) {
	const { username, password } = req.body;

	try {
		if (!username) {
			throw new Error("Falta nombre de usuario");
		}

		if (!password) {
      throw new Error("Falta la contraseña");
    }

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}