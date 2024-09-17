import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";
import Utils from "../../utils.js";

class Lote extends Model { }

Lote.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nroLote: {
    type:  DataTypes.STRING(),
    allowNull: false,
    unique: true,
    defaultValue: Utils.crearNroLote,
    validate: {
      is: {
        args: /^L\d{4}-\d{2}-\d{2}\/\d{2}:\d{2}:\d{2}$/,
        msg: "Formato de Nro de lote incorrecto"
      },
      notNull: {
        msg: "El número de lote es requerido"
      }
    }
  },
  vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de vencimiento no es una fecha"
      },
      notNull: {
        msg: "La fecha de vencimiento es requerida"
      }
    }
  },
  fechaFabricacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de fabricacion no es una fecha"
      },
      notNull: {
        msg: "La fecha de fabricacion es requerida"
      }
    }
  },
  fechaCompra: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de compra no es una fecha"
      },
      notNull: {
        msg: "La fecha de compra es requerida"
      }
    }
  },
  fechaAdquisicion: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de adquisicion no es una fecha"
      },
      notNull: {
        msg: "La fecha de adquisición es requerida"
      }
    }
  },
  cantidad: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      isInt: {
        msg: "El numero ingresado en la cantidad de vacunas del lote no un número entero"
      },
      notNull: {
        msg: "La cantidad de vacunas del lote es requerida"
      },
      min: {
        args: 1,
        msg: "El valor minimo para la cantidad de vacunas del lote es de 1"
      }
    }
  }
}, {
  sequelize,
  modelName: "Lote",
  tableName: "lotes",
  timestamps: false,
  freezeTableName: true
});

export { Lote };