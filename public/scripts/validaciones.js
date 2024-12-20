import { agregarClases, removerClases, getElementById } from "./frontUtils.js";

export function setValidInputStyle(id) {
  const input = getElementById(id);
  removerClases(input, "is-invalid");
  agregarClases(input, "is-valid");
}

export function setInvalidInputStyle(id) {
  const input = getElementById(id);
  removerClases(input, "is-valid");
  agregarClases(input, "is-invalid");
}

export function validarFormSelect(value) {
  if (value === "") {
    return false;
  }
  return true;
}

export function validarUUIDv4(id) {
  const regex = /^[0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[89ab][0-9a-f]{3}\-[0-9a-f]{12}$/i;
  return regex.test(id);
}

function validarLote(lote) {
  if (!lote) return false;
  return validarUUIDv4(lote);
}

export function validarFecha(fecha) {
  if (!fecha) return false;

  let fechaSel = new Date(fecha);
  if (!fechaSel) return false;
  fechaSel = fechaSel.getTime();

  const fechaAct = new Date().getTime();
  if (fechaSel > fechaAct) return false;
  
  return true;
}

function validarCodigo(codigo) {
  if (!codigo) return false;

  codigo += "";

  if (codigo.includes(".") || codigo.includes("+") || codigo.includes("e") || codigo.includes("-")) return false;

  if (codigo.length !== 4) return false;

  if (!Number.parseInt(codigo)) return false

  return true;
}

export function validarInputNumberPositivo(value) {
  if (!value) return false;
  value += "";

  if (value.includes(".") || value.includes("+") || value.includes("e") || value.includes("-")) return false;

  const num = Number.parseInt(value);
  if (!num) return false
  if (num < 0) return false

  return true;
}

function validarMotivo(motivo) {
  // if (!motivo) return false;
  // if (motivo.length > 100) return false;

  // return true;
  return validarFormSelect(motivo);
}

export function validarDNI(dni) {
  if (!dni) return false;

  const regex = /^\d{8}$/;
  if (!regex.test(dni)) return false;

  return true;
}

export function validarFormularioDescarte(values) {
  let isValid = true;

  if (!validarFormSelect(values.formaDescarte)) {
    setInvalidInputStyle("forma-descarte");
    isValid = isValid && false;
  } else {
    setValidInputStyle("forma-descarte");
    isValid = isValid && true;
  }

  // if (!validarLote(values.lote)) {
  //   setInvalidInputStyle("lote");
  //   isValid = isValid && false;
  // } else {
  //   setValidInputStyle("lote");
  //   isValid = isValid && true;
  // }

  if (!validarFecha(values.fecha)) {
    setInvalidInputStyle("fecha");
    isValid = isValid && false;
  } else {
    setValidInputStyle("fecha");
    isValid = isValid && true;
  }

  if (!validarCodigo(values.codigo)) {
    setInvalidInputStyle("codigo");
    isValid = isValid && false;
  } else {
    setValidInputStyle("codigo");
    isValid = isValid && true;
  }

  if (!validarMotivo(values.motivo)) {
    setInvalidInputStyle("motivo");
    isValid = isValid && false;
  } else {
    setValidInputStyle("motivo");
    isValid = isValid && true;
  }

  return isValid;
}

export function validarFormSolicitarSublote(values) {
  let isValid = true;

  if (!validarFormSelect(values.tipoVacuna)) {
    setInvalidInputStyle("vacuna");
    isValid = isValid && false;
  } else {
    setValidInputStyle("vacuna");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.provincia)) {
    setInvalidInputStyle("provincia");
    isValid = isValid && false;
  } else {
    setValidInputStyle("provincia");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.cantidad)) {
    setInvalidInputStyle("cantidad");
    isValid = isValid && false;
  } else {
    setValidInputStyle("cantidad");
    isValid = isValid && true;
  }

  return isValid;
}

export function validarFormSolicitarMinilote(values) {
  let isValid = true;

  if (!validarFormSelect(values.tipoVacuna)) {
    setInvalidInputStyle("vacuna");
    isValid = isValid && false;
  } else {
    setValidInputStyle("vacuna");
    isValid = isValid && true;
  }

  if (!validarFormSelect(values.centro)) {
    setInvalidInputStyle("centro");
    isValid = isValid && false;
  } else {
    setValidInputStyle("centro");
    isValid = isValid && true;
  }

  if (!validarInputNumberPositivo(values.cantidad)) {
    setInvalidInputStyle("cantidad");
    isValid = isValid && false;
  } else {
    setValidInputStyle("cantidad");
    isValid = isValid && true;
  }

  return isValid;
}