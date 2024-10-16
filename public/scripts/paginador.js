import { getElementById, agregarClases, removerClases, createElement } from "./frontUtils.js";

export default class Paginador {
  #paginaActual;
  #cantidadPaginadores;
  #resultadosPorPagina;
  #eventoClicksEnLasPaginasDelPaginador;

  constructor({cantidadPaginadores = 1, paginaActual = 1, resultadosPorPagina = 10} = {}) {
    this.#paginaActual = paginaActual;
    this.#cantidadPaginadores = cantidadPaginadores;
    this.#resultadosPorPagina = resultadosPorPagina;
    this.#eventoClicksEnLasPaginasDelPaginador = () => {console.log("no se asocio evento al paginador")};
  }

  incrementarPagina() {
    this.#paginaActual++;
  }

  decrementarPagina() {
    this.#paginaActual--;
  }

  setNavegacion (dir) {
    return async (e) => {
      if (e.target.classList.contains("disabled")) return;

      if (dir === "der") {
        this.incrementarPagina();
      } else {
        this.decrementarPagina();
      }

      this.#eventoClicksEnLasPaginasDelPaginador();

      this.actualizarPaginador();
    };
  }

  actualizarPaginador() {
    this.removerPaginadores();
    let i = 0;
  
    while (i < this.cantidadPaginadores) {
      const li = createElement("li", {}, "page-item");
      const span = createElement("span", { content: (i+1).toString() }, "page-link", "cursor-pointer");
  
      if (i === this.paginaActual - 1) {
        agregarClases(span, "active");
      } else {
        removerClases(span, "active");
      }
  
      li.appendChild(span);
  
      li.addEventListener("click", (() => {
        let pagina = i+1;
        return async (e) => {
          if (!e.target.classList.contains("active")) {
            this.paginaActual = pagina;
            this.#eventoClicksEnLasPaginasDelPaginador();
          }
        };
      })());
  
      getElementById("flecha-pag-der").before(li);
  
      i++;
    }
  
    this.actualizarFlechasPaginador();
  }

  removerPaginadores() {
    const ul = getElementById("paginador");
    const liElements = ul.getElementsByTagName("li");
  
    if (liElements.length > 2) {
      for (let i = liElements.length - 2; i > 0; i--) {
        ul.removeChild(liElements[i]);
      }
    }
  }

  actualizarFlechasPaginador() {
    if (this.#cantidadPaginadores === 1) {
      agregarClases(getElementById("flecha-pag-der"), "disabled");
      agregarClases(getElementById("flecha-pag-izq"), "disabled");
      return;
    }
  
    if (this.#paginaActual === 1) {
      agregarClases(getElementById("flecha-pag-izq"), "disabled");
      removerClases(getElementById("flecha-pag-der"), "disabled");
      return;
    }
  
    if (this.#paginaActual < this.#cantidadPaginadores) {
      removerClases(getElementById("flecha-pag-izq"), "disabled");
      removerClases(getElementById("flecha-pag-der"), "disabled");
      return;
    }
  
    if (this.#paginaActual === this.#cantidadPaginadores) {
      removerClases(getElementById("flecha-pag-izq"), "disabled");
      agregarClases(getElementById("flecha-pag-der"), "disabled");
      return;
    }
  
    return;
  }

  setFuncionEnviarPeticionPaginador(funcionDelEvento) {
    this.#eventoClicksEnLasPaginasDelPaginador = funcionDelEvento;
  }

  resetCantidadPaginadores() {
    this.#cantidadPaginadores = 1;
  }

  get instanciaPaginador() {
    return this;
  }

  get cantidadPaginadores() {
    return this.#cantidadPaginadores;
  }

  get paginaActual() {
    return this.#paginaActual;
  }

  get resultadosPorPagina() {
    return this.#resultadosPorPagina;
  }

  set cantidadPaginadores(cantidad) {
    this.#cantidadPaginadores = cantidad;
  }

  set paginaActual(pagina) {
    this.#paginaActual = pagina;
  }

  set resultadosPorPagina(resultadosPorPagina) {
    this.#resultadosPorPagina = resultadosPorPagina;
  }
}