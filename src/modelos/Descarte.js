import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Descarte extends Model { }

Descarte.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  motivo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1,100]
    }
  },
  formaDescarte: {
    type: DataTypes.ENUM(),
    values: ["INCINERACION", "OTRO"],
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [["INCINERACION", "OTRO"]]
    }
  }
}, {
  sequelize,
  modelName: "Descarte",
  tableName: "descartes",
  timestamps: false,
  freezeTableName: true
});

export { Descarte };