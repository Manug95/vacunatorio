import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Vacunacion extends Model { }

Vacunacion.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: true,
      notNull: true
    }
  }
}, {
  sequelize,
  modelName: "Vacunacion",
  tableName: "vacunaciones",
  timestamps: false,
  freezeTableName: true
});

export { Vacunacion };