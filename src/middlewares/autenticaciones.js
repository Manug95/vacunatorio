import jwt from "jsonwebtoken";

const pathsPublicos = ["login", "authenticate"];
const JWT_SECREY_KEY = process.env.JWT_SECREY_KEY ?? "clave secreta jwt";

export function autenticarUsuario(req, res, next) {
  if (pathsPublicos.some(p => req.originalUrl.includes(p))) next();
  
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).redirect("/usuarios/login");
  }

  try {
    const data = jwt.verify(token, JWT_SECREY_KEY);
    req.userData = data; // { id, username, rol}
    req.userData.isLogged = true;
    next();
  } catch (error) {
    return res.status(401).redirect("/usuarios/login");
  }
}