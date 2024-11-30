import vacunacionServicio from "../servicios/vacunacionServicio.js";
import personalServicio from "../servicios/personalServicio.js";
import centroVacunacionServicio from "../servicios/centroVacunacionServicio.js";
import pacienteServicio from "../servicios/pacienteServicio.js";
import distribucionProvincialServicio from "../servicios/distribucionProvincialServicio.js";
import pug from "pug";

export default class VacunacionControlador {
	static async crear(req, res) {
		let statusCode = 201;
		const respuesta = { ok: true };
		const { dni, centro, enfermero, vacuna } = req.body;

		try {
			const paciente = await pacienteServicio.buscarPacientePorDNI(dni);
			if (!paciente) throw new Error(`El paciente con DNI: ${dni} no existe`);

			const distribucion = await distribucionProvincialServicio.getDistribucionPorTipoVacunaYCentroVacunacion({ tipoVacuna: vacuna, centro });
			if (!distribucion || distribucion.length === 0) throw new Error(`No hay vacunas`);

			await vacunacionServicio.crearVacunacion({ pacienteId: paciente.id, centroId: centro, personalId: enfermero, miniloteId: distribucion[0].miniloteId });
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

	static async vistaFormVacunacion(req, res) {
		let centros, vacunas = [], enfermeros;

    try {
      [centros, enfermeros] = await Promise.all([
				centroVacunacionServicio.getCentrosDeVacunaciones(),
				personalServicio.getEnfermeros({}),
				// vacunaServicio.getTiposDeVacunas()
			]);
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/vacunacion.pug", {
        centros: centros ?? [],
        vacunas: vacunas ?? [],
        enfermeros: enfermeros ?? [],
        activeLink: { "vacunacion": "active-link" },
				tabTitle: "registrar vacunación",
				isLogged: req.userData.isLogged,
        rol: req.userData.rol
      }));
    }
	}
}