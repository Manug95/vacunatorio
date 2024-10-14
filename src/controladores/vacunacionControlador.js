import vacunacionServicio from "../servicios/vacunacionServicio.js";

export default class VacunacionControlador {
	static async crear(req, res) {
		let statusCode = 201;
		const respuesta = { ok: true };
		const { pacienteId, centroId, personalId, miniloteId } = req.body;

		try {
			await vacunacionServicio.crearVacunacion({ pacienteId, centroId, personalId, miniloteId });
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