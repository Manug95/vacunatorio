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
	const { sublote, cantidad, centro } = req.body;

  try {
		if (!sublote) {
      throw new Error("Es necesario especificar el sublote origen del sublote");
    }

    if (!centro) {
      throw new Error("Es necesario especificar el centro de vacunación a la que se enviaran las vacunas");
    }

    // if (!cantidad) {
    //   throw new Error("Es necesario especificar la cantidad de vacunas que se quieren");
    // }

    validarCantidad(cantidad);

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarRedistribucionMiniLote(req, res, next) {
  const { distribucion, minilote, cantidad, centroOrigen, centroDestino } = req.body;

	try {
		if (!minilote) {
			throw new Error("Es necesario especificar el sublote origen del sublote");
		}

		if (!centroOrigen) {
			throw new Error("Es necesario especificar el centro de vacunación origen desde la que se enviaran las vacunas");
		}

		if (!centroDestino) {
			throw new Error("Es necesario especificar el centro de vacunación destino al que se enviaran las vacunas");
		}
		
		if (!distribucion) {
			throw new Error("Es necesario especificar la id de la distribucion provincial");
		}

		// if (!cantidad) {
		//   throw new Error("Es necesario especificar la cantidad de vacunas que se quieren");
		// }

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
  const { distribucion, motivo, formaDescarte } = req.body;

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
	const { dni, nombres, apellidos, email, telefono, fechaNac, genero } = req.body;

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

		next();
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
}

export function validarVacunacion(req, res, next) {
	const { pacienteId, centroId, personalId, miniloteId } = req.body;

	try {
		if (!pacienteId) {
			throw new Error("Falta el paciente");
		}

		if (!centroId) {
      throw new Error("Falta el centro de vacunación");
    }

    if (!personalId) {
      throw new Error("Falta el/la enfermero/a");
    }

    if (!miniloteId) {
      throw new Error("Falta el minilote");
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