import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Almacena extends Model { }

Almacena.init({
  fechaAdquisicion: {
    type: DataTypes.DATE,
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
  }
}, {
  sequelize,
  modelName: "Almacena",
  tableName: "almacena",
  timestamps: true,
  createdAt: false,
  updatedAt: true,
  freezeTableName: true
});

export { Almacena };