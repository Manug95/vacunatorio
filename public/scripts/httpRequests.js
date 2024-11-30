import { mostrarMensaje } from "./frontUtils.js";

export function funcionEnviarPost(url) {
  return async function (formValues) {
    const respuesta = await enviarPOST(url, formValues);
    mostrarMensaje(respuesta.ok, respuesta.mensaje ?? "Operación realizada");
  }
}

const optionsGET = {
  headers: {
    'Accept': 'application/json'
  }
}

const optionsPOST = {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

const optionsDELETE = {
  method: "DELETE",
}

const optionsPUT = {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  }
}

const optionsPATCH = {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  }
}



/**
 * Realiza la peticion GET al servidor
 * @param {String} url La url a donde se enviaran los datos de la peticion
 * @param {Object} headers Un objeto con las cabeceras de la peticion
 */
export async function enviarGET(url, headers) {
  // if (headers) optionsGET.headers = headers;
  if (headers) Object.assign(optionsGET.headers, headers);

  let datosRespuesta = null;

  try {
    const respuesta = await fetch(url);
    if (respuesta.ok) {
      datosRespuesta = await respuesta.json();
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    return datosRespuesta;
  }

}



/**
 * Realiza la peticion POST al servidor
 * @param {String} url La url a donde se enviaran los datos de la peticion
 * @param {Object} datos Objeto con los datos a enviar en la peticion
 * @param {Object} headers Un objeto con las cabeceras de la peticion
 */
export async function enviarPOST(url, datos, headers) {

  optionsPOST.body = JSON.stringify(datos);

  if (headers) Object.assign(optionsPOST.headers, headers);

  let datosRespuesta;

  try {
    const respuesta = await fetch(url, optionsPOST);
    datosRespuesta = await respuesta.json();
  } catch (e) {
    console.log(e.message);
    datosRespuesta = { ok: false, mensaje: "Error al hacer la peticion" };
  } finally {
    return datosRespuesta;
  }

}



/**
 * Realiza la peticion DELETE al servidor
 * @param {String} url La url, con la id del registro a borrar, a donde se enviara la peticion
 * @param {Object} headers Un objeto con las cabeceras de la peticion
 */
export async function enviarDELETE(url, headers) {

  if (headers) optionsDELETE.headers = headers;

  let datosRespuesta;

  try {
    const respuesta = await fetch(url, optionsDELETE);
    datosRespuesta = await respuesta.json();
  } catch (e) {
    console.log(e.message);
    datosRespuesta = { ok: false, mensaje: "Error al hacer la peticion" };
  } finally {
    return datosRespuesta;
  }

}



/**
 * Realiza la peticion PUT al servidor
 * @param {String} url La url a donde se enviaran los datos de la peticion
 * @param {Object} datos Objeto con los datos a enviar en la peticion
 * @param {Object} headers Un objeto con las cabeceras de la peticion
 */
export async function enviarPUT(url, datos, headers) {

  optionsPUT.body = JSON.stringify(datos);

  if (headers) Object.assign(optionsPUT.headers, headers);

  let datosRespuesta;
  
  try {
    const respuesta = await fetch(url, optionsPUT);
    datosRespuesta = await respuesta.json();
  } catch (e) {
    console.log(e.message);
    datosRespuesta = { ok: false, mensaje: "Error al hacer la peticion" };
  } finally {
    return datosRespuesta;
  }

}



/**
 * Realiza la peticion PATCH al servidor
 * @param {String} url La url a donde se enviaran los datos de la peticion
 * @param {Object} datos Objeto con los datos a enviar en la peticion
 * @param {Object} headers Un objeto con las cabeceras de la peticion
 */
export async function enviarPATCH(url, datos, headers) {

  optionsPATCH.body = JSON.stringify(datos);

  if (headers) Object.assign(optionsPATCH.headers, headers);

  let datosRespuesta;
  
  try {
    const respuesta = await fetch(url, optionsPATCH);
    datosRespuesta = await respuesta.json();
  } catch (e) {
    console.log(e.message);
    datosRespuesta = { ok: false, mensaje: "Error al hacer la peticion" };
  } finally {
    return datosRespuesta;
  }

}