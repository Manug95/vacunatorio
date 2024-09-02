import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Almacena extends Model { }

Almacena.init({
  fechaAdquisicion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha-adquisicion',
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