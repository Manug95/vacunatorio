import jwt from "jsonwebtoken";

const pathsPublicos = ["login"];
const JWT_SECREY_KEY = process.env.JWT_SECREY_KEY ?? "clave secreta jwt";

export function autenticarUsuario(req, res, next) {
  if (pathsPublicos.some(p => req.originalUrl.includes(p))) next();
  
  
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).redirect("/login");
    }
    
    const data = jwt.verify(token, JWT_SECREY_KEY);
    req.userData = data; // { id, username, rol, name}
    req.userData.isLogged = true;
    next();
  } catch (error) {
    return res.status(401).redirect("/login");
  }
}