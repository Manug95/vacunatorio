import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class SubLote extends Model { }

SubLote.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fechaSalida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  fechaLlegada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // esto despues se borra (hacer.txt)
    allowNull: false,
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
  modelName: "SubLote",
  tableName: "sub-lote",
  timestamps: false,
  freezeTableName: true
});

export { SubLote };