import { Usuario } from "../modelos/relaciones.js";
import { capturarErroresDeSequelize } from "../../utils.js";
import bcrypt from "bcrypt";
import { PasswordError } from "../modelos/Errores/errores.js";

let instanciaServicio;
const SALT = process.env.SALT ?? 10;

class UsuarioServicio {
  
  constructor() {
    if (instanciaServicio) {
      throw new Error("Solo se puede crear una instancia!");
    }
    instanciaServicio = this;
  }

  async crear({ username, password, rol, personal, transaction }) {
    try {
      this.#validatePassword(password);

      const newUser = { 
        username, 
        rol, 
        personalId: personal 
      };
  
      newUser.password = await bcrypt.hash(password, +SALT);

      if (transaction) {
        return await Usuario.create(newUser, { transaction: transaction });
      } else {
        return await Usuario.create(newUser);
      }

    } catch (error) {
      if (error instanceof PasswordError) throw error;
      capturarErroresDeSequelize(error);
      throw new Error("Hubo un problema al realizar la operación");
    }
  }

  async login({ username, password }) {
    try {
      const user = await Usuario.findOne({where: { username} });
      if (!user) throw new Error("usuario o contraseña es incorrecto(s)");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("usuario o contraseña es incorrecto(s)");

      const personal = await user.getPersonal();

      return {
        id: user.id,
        username: user.username,
        rol: user.rol,
        name: `${personal.dataValues.apellidos}, ${personal.dataValues.nombres}`
      };
    }
    catch (error) {
      throw error;
    }
  }

  #validatePassword(password) {
    if (!password) throw new PasswordError("La contraseña es requerida");
    if (typeof password !== "string") throw new PasswordError("La contraseña ingresada no es una cadena de texto");
    if (password.length < 6 || password.length > 25) throw new PasswordError("La contraseña debe tener entre 6 y 25 caracteres");
  }

}

const usuarioServicio = Object.freeze(new UsuarioServicio());

export default usuarioServicio;