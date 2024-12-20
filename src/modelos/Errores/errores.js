export class NoAffectedRowsError extends Error {
    constructor(message = "Error") {
        super(message);
        this.name = "NoAffectedRowsError";
      }
}

export class DataOutOfRangeError extends Error {
  constructor(message = "Error") {
      super(message);
      this.name = "OutOfRangeError";
    }
}

export class SinStockError extends Error {
  constructor(message = "Error") {
    super(message);
    this.name = "SinStockError";
  }
}

export class MissingParamError extends Error {
  constructor(message = "Error") {
    super(message);
    this.name = "MissingParamError";
  }
}

export class PasswordError extends Error {
  constructor(message = "Error") {
    super(message);
    this.name = "PasswordError";
  }
}