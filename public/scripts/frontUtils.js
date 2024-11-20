/**
 * Funcion manejadora que impide que se pude escribir un espacio en un input
 * @param {Event} event El evento que desato la funcion
 */
function bloquearEspacios(event) {
  if (event.key === " ") {
    event.preventDefault();
  }
}



/**
 * Oculta un elemento
 * @param {String} id id del elemento que se desa¿ea ocultar
 */
function ocultarElemento(id) {
  agregarClases(getElementById(id), "d-none");
}



/**
 * Muestra un elemento que esta oculto
 * @param {String} id id del elemento que se desa¿ea mostrar
 */
function mostrarElemento(id) {
  removerClases(getElementById(id), "d-none")
}



/**
 * Recupera un elemento HTML del DOM por su ID
 * @param {String} id La id del elemento a recuperar
 * @returns {HTMLElement} El elemento HTML recurado
 */
function getElementById(id) {
  return document.getElementById(id);
}



/**
 * Recupera el value de un input de un formulario
 * @param {String} id La id del input a recuperar
 * @returns {String} El value del input
 */
function getFormInputValue(id) {
  return getElementById(id).value;
}



/**
 * retorna la cantidad de elementos hijos que tiene un elemento html
 * @param {String} id del elemento que se quiere contar sus hijos
 * @returns {Number} la cantidad de hijos del elemento
 */
function cantidadHijosDeUnElemento(id) {
  return getElementById(id).childElementCount;
}



/**
 * Abre un modal mostrando un mensaje con el estado de la peticion al servidor
 * @param {Boolean} ok Booleano que indica si la peticion fue exitosa o no
 * @param {*} mensaje El mensaje de exito o no de la peticion que contiene la respuesta
 */
function mostrarMensaje(ok, mensaje) {
  const myModal = new bootstrap.Modal(getElementById('modal-mensaje'), {});
  if (ok) {
    mensajeExito(mensaje, "mensaje");
    myModal.show();
  }
  else {
    mensajeError(mensaje, "mensaje");
    myModal.show();
  }
}



/**
 * Abre un modal mostrando un mensaje con el estado de la peticion al servidor
 * @param {Boolean} ok Booleano que indica si la peticion fue exitosa o no
 * @param {*} mensaje El mensaje de exito o no de la peticion que contiene la respuesta
 */
function mostrarPregunta(pregunta) {
  const myModal = new bootstrap.Modal(getElementById('modal-pregunta'), {});
  mensajeError(pregunta, "pregunta");
  myModal.show();
}



/**
 * 
 * @param {String} mensaje Es el mensaje a mostrar en el modal
 */
function mensajeError(mensaje, elem_id) {
  // const cartel = getElementById("mensaje");
  const cartel = getElementById(elem_id);

  // quitarClaseSuccess(cartel);
  // agregarClaseDanger(cartel);

  removerClases(cartel, "text-success");
  agregarClases(cartel, "text-danger");

  cartel.innerHTML = mensaje;
}



/**
 * 
 * @param {String} mensaje Es el mensaje a mostrar en el modal
 */
function mensajeExito(mensaje, elem_id) {
  // const cartel = getElementById("mensaje");
  const cartel = getElementById(elem_id);

  // quitarClaseDanger(cartel);
  // agregarClaseSuccess(cartel);

  removerClases(cartel, "text-danger");
  agregarClases(cartel, "text-success");

  cartel.innerHTML = mensaje;
}



/**
 * @param {HTMLElement} el el elemento del dom a agregarle las clases
 * @param  {...string} clases las clases a agregar
 */
function agregarClases(el, ...clases) {
  el.classList.add(...clases);
}



/**
 * @param {HTMLElement} el el elemento del dom a removerle las clases
 * @param  {...string} clases las clases a remover
 */
function removerClases(el, ...clases) {
  el.classList.remove(...clases);
}


/**
 * 
 * @param {string} el nombre del elemento a crear
 * @param {*} atributos objeto con los atributos para elemento nuevo
 * @param  {...string} classes 
 * @returns {HTMLElement}
 */
function createElement( el, { id, value, name, selected, disabled, content, type, href, src, colSpan }, ...classes ) {
  const elemento = document.createElement(el);

  if (id) elemento.id = id;
  if (value) elemento.value = value;
  if (name) elemento.name = name;
  if (type) elemento.type = type;
  if (href) elemento.href = href;
  if (src) elemento.href = src;
  if (selected) elemento.selected = selected;
  if (disabled) elemento.disabled = disabled;
  if (colSpan) elemento.colSpan = colSpan;
  if (content instanceof HTMLElement) {
    elemento.appendChild(content);
  } else if (typeof content === "string") {
    elemento.textContent = content;
  }

  agregarClases(elemento, ...classes);

  return elemento;
}



/**
 * Recarga la pagina si el recurso se borro con exito
 */
function recargar() {

  if (getElementById("mensaje").classList.contains("text-success")) {
    window.location.reload();
  }
  
}



/**
 * Captura el campo hidden del formulario de editar y devuelve su valor
 * @returns {String} Devuelve la id de la instancia del recurso
 */
function obtenerIdDelCampoHidden() {
  return document.querySelector('[type="hidden"]').value;
}



export {
  ocultarElemento,
  mostrarElemento,
  agregarClases,
  removerClases,
  cantidadHijosDeUnElemento,
  getElementById,
  getFormInputValue,
  bloquearEspacios,
  mostrarMensaje,
  mostrarPregunta,
  recargar,
  obtenerIdDelCampoHidden,
  createElement
}