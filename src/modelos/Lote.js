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
      }
    }
  },
  vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  fechaFabricacion: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  fechaCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  cantidad: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      isNumeric: true,
      isInt: true,
      notNull: true,
      min: 1
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