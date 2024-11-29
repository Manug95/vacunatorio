import pug from "pug";
import { sequelize } from "../../sequelize.js";
import pacienteServicio from "../servicios/pacienteServicio.js";
import provinciaServicio from "../servicios/provinciaServicio.js";
import localidadServicio from "../servicios/localidadServicio.js";

export default class PacienteControlador {
	static async crear(req, res) {
		let statusCode = 201;
		const respuesta = { ok: true };
		const { dni, nombres, apellidos, email, telefono, fechaNac, genero, localidad, provincia } = req.body;

		const transaction = await sequelize.transaction();
		try {
			let loc = await localidadServicio.getLocalidadPorNombreYProvincia({ localidad, provinciaId: provincia });
			if (!loc) {
				loc = await localidadServicio.crearLocalidad({ nombre: localidad, provinciaId: provincia, transaction });
			}
			await pacienteServicio.crearPaciente({ dni, nombres, apellidos, email, telefono, fechaNac, genero, localidad: loc.id, transaction });
			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();

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

	static async vistaFormRegistrarPaciente(req, res) {
		let provincias;

    try {
      provincias = await provinciaServicio.getProvincias();
    } catch(e) {
      console.error(e);
    } finally {
      res.send(pug.renderFile("src/vistas/formularios/registrarPaciente.pug", {
        pretty: true,
        provincias: provincias ?? [],
        activeLink: { "registrarPaciente": "active-link" },
				tabTitle: "registrar paciente",
				isLogged: req.userData.isLogged
      }));
    }
  }
}