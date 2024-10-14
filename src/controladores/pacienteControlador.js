import pacienteServicio from "../servicios/pacienteServicio.js";

export default class PacienteControlador {
	static async crear(req, res) {
		let statusCode = 201;
		const respuesta = { ok: true };
		const { dni, nombres, apellidos, email, telefono, fechaNac, genero } = req.body;

		try {
			await pacienteServicio.crearPaciente({ dni, nombres, apellidos, email, telefono, fechaNac, genero });
		}
		catch (error) {

			statusCode = 400;
			respuesta.ok = false;
			respuesta.mensaje = error.message;

		}
		finally {
			res.status(statusCode).json(respuesta);
		}
	}

	static async buscarPorId(req, res) {
		let statusCode = 200;
		const respuesta = { ok: true };
		const { id } = req.params;

		try {
			if (!id) throw new Error("Falta la id del paciente");

			respuesta.body = await pacienteServicio.buscarPacientePorID(id);
		}
		catch (error) {

			statusCode = 400;
			respuesta.ok = false;
			respuesta.mensaje = error.message;

		}
		finally {
			res.status(statusCode).json(respuesta);
		}
	}

	static async buscarPorDni(req, res) {
		let statusCode = 200;
		const respuesta = { ok: true };
		const { dni } = req.params;

		try {
			if (!dni) throw new Error("Falta el DNI del paciente");

			respuesta.body = await pacienteServicio.buscarPacientePorDNI(dni);
		}
		catch (error) {

			statusCode = 400;
			respuesta.ok = false;
			respuesta.mensaje = error.message;

		}
		finally {
			res.status(statusCode).json(respuesta);
		}
	}
}