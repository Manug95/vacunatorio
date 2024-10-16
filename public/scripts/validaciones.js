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

function validarFecha(fecha) {
  if (!fecha) return false;
  return true;
}

function validarCodigo(codigo) {
  if (!codigo) return false;

  codigo += "";

  if (codigo.includes(".") || codigo.includes("+") || codigo.includes("e")) return false;

  if (codigo.length !== 4) return false;

  if (!Number.parseInt(codigo)) return false

  return true;
}

function validarMotivo(motivo) {
  if (!motivo) return false;
  if (motivo.length > 100) return false;

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

  if (!validarLote(values.lote)) {
    setInvalidInputStyle("lote");
    isValid = isValid && false;
  } else {
    setValidInputStyle("lote");
    isValid = isValid && true;
  }

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