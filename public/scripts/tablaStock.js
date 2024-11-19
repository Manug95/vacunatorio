import { getElementById, createElement, agregarClases } from "./frontUtils.js";

export function renderizarTablaStock(datos, depositoSeleccionado, rutaDescarte, redistribuible) {
  getElementById("titulo").textContent = "Stock disponible en " + depositoSeleccionado;
  const tabla = getElementById("cuerpo");
  tabla.innerHTML = "";

  datos.forEach(d => {
    const fila = createElement("tr", { id: d.id });

    Object.keys(d).forEach(key => {
      if (key !== "id") {
        fila.appendChild(createElement("td", { content: d[key].toString() }, "align-middle", "text-center", "text-break"));
      }
    });

    const tdAccion = createElement("td", { colSpan: redistribuible ? "2" : "1" }, "ps-3", "align-middle", "text-center");
    if (redistribuible) {
      const enlaceRedistribuir = createElement("a", { content: "Redistribuir", href: `/minilotes/redistribuir?dist=${d.id}` }, "me-2","btn", "btn-primary");
      tdAccion.appendChild(enlaceRedistribuir);
    }
    const enlaceDescartar = createElement("a", { content: "Descartar", href: rutaDescarte+d.id }, "btn", "btn-warning");
    tdAccion.appendChild(enlaceDescartar);
    fila.appendChild(tdAccion);

    // fila.appendChild(
    //   createElement(
    //     "td", 
    //     { 
    //       content: createElement("a", { content: "Descartar", href: rutaDescarte+d.id }, "btn", "btn-warning")
    //     }, 
    //     "ps-3", "align-middle", "text-center"
    //   )
    // );

    const f = new Date(d.vencimiento.split("-").reverse().join("-"));
    if (f.getTime() < Date.now()) {
      agregarClases(fila, "table-danger");
    }

    tabla.appendChild(fila);
  });
  
}

export function crearFilaMensajeDeTablaStock(mensaje, tabla = getElementById("cuerpo"), redistribuible = false) {
  tabla.innerHTML = "";
  const fila = createElement("tr", {});
  const td = createElement("td", { content: mensaje, colSpan: redistribuible ? "7" : "6" }, "align-middle", "text-center");
  fila.appendChild(td);
  tabla.appendChild(fila);
}

export function renderizarTablaSolicitudesSublotes(datos, rutaCrearSublote) {
  const tabla = getElementById("cuerpo");
  tabla.innerHTML = "";

  datos.forEach(s => {
    const fila = createElement("tr", {});

    Object.keys(s).forEach(key => {
      if (key !== "id") {
        fila.appendChild(createElement("td", { content: s[key].toString() }, "align-middle", "text-center", "text-break"));
      }
    });

    fila.appendChild(
      createElement(
        "td", 
        { 
          content: createElement(
            "a", 
            { content: "Enviar", href: `/sublotes/crear?sol=${s.id}&tipoVac=${s.tipoVacuna}&prov=${s.provincia}&cant=${s.cantidad}` }, 
            "btn", "btn-primary", "p-1")
        },
        "ps-3", "align-middle", "text-center"
      ));

      tabla.appendChild(fila);
  });
  
}

export function renderizarTablaSolicitudesMinilotes(datos) {
  const tabla = getElementById("cuerpo");
  tabla.innerHTML = "";

  datos.forEach(s => {
    const fila = createElement("tr", {});

    Object.keys(s).forEach(key => {
      if (key !== "id") {
        fila.appendChild(createElement("td", { content: s[key].toString() }, "align-middle", "text-center", "text-break"));
      }
    });

    fila.appendChild(
      createElement(
        "td", 
        { 
          content: createElement(
            "a", 
            { content: "Enviar", href: `/minilotes/crear?sol=${s.id}&tipoVac=${s.tipoVacuna}&centro=${s.centro}&cant=${s.cantidad}` }, 
            "btn", "btn-primary", "p-1")
        },
        "ps-3", "align-middle", "text-center"
      ));

      tabla.appendChild(fila);
  });
  
}

// export function crearFilaMensajeDeTablaSolicitudesCompra(mensaje, tabla = getElementById("cuerpo")) {
//   tabla.innerHTML = "";
//   const fila = createElement("tr", {});
//   const td = createElement("td", { content: mensaje, colSpan: "5" }, "align-middle", "text-center");
//   fila.appendChild(td);
//   tabla.appendChild(fila);
// }

export function renderizarTablaCslt1(datos) {
  const tabla = getElementById("cuerpo");
  tabla.innerHTML = "";

  datos.forEach(d => {
    const fila = createElement("tr", {});

    Object.keys(d).forEach(key => {
      fila.appendChild(createElement("td", { content: d[key].toString() }, "align-middle", "text-center", "text-break"));
    });

    tabla.appendChild(fila);
  });
  
}

export function crearFilaMensaje({ mensaje, idTabla, cantColumnas }) {
  const tabla = getElementById(idTabla);
  tabla.innerHTML = "";
  const fila = createElement("tr", {});
  const td = createElement("td", { content: mensaje, colSpan: cantColumnas }, "align-middle", "text-center");
  fila.appendChild(td);
  tabla.appendChild(fila);
}