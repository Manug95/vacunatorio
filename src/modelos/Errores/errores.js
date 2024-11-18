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