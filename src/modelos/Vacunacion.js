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
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: "La fecha tiene un formato incorrecto",
        args: true
      },
      notNull: {
        msg: "La fecha de vacunación es requerida"
      }
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