import usuarioServicio from "../servicios/usuarioServicio.js";
import jwt from "jsonwebtoken";
import pug from "pug";

const JWT_SECREY_KEY = process.env.JWT_SECREY_KEY ?? "clave secreta jwt";

export default class UsuarioControlador {
  static async crear(req, res) {
    let status = 201;
    const respuesta = { ok: true };
  
    try {
      const nuevoUsuario = await usuarioServicio.crear(req.body);
    }
    catch (error) {
      respuesta.ok = false;
      respuesta.mensaje = error.message;
      status = 400;
    }
    finally {
      return res.status(status).json(respuesta);
    }
  }

  static async login(req, res) {
    const respuesta = { ok: true };

    try {
      const usuario = await usuarioServicio.login(req.body);

      const token = jwt.sign(usuario, JWT_SECREY_KEY, { expiresIn: "8h"});

      respuesta.mensaje = `Bienvenid@ ${usuario.name}!`;

      return res
      .cookie("access_token", 
        token, 
        { 
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 8 // 8 horas
        })
      .status(200)
      .json(respuesta);
    }
    catch (error) {
      respuesta.ok = false;
      respuesta.mensaje = error.message;

      return res.status(400).json(respuesta);
    }
  }

  static async logout(req, res) {
    return res
      .clearCookie("access_token")
      .redirect("/login")
    ;
  }

  static async vistaLogin(req, res) {
    return res.send(pug.renderFile("src/vistas/login.pug", {
      tabTitle: "login",
      activeLink: {}
    }));
  }

  static async vistaRegistro(req, res){
    return res.send(pug.renderFile("src/vistas/register.pug", {
      tabTitle: "Registrar usuario",
      activeLink: {},
      isLogged: req?.userData?.isLogged,
      rol: req.userData.rol
    }));
  }
}