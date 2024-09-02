import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Vacuna extends Model { }

Vacuna.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreComercial: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  }
}, {
  sequelize,
  modelName: "Vacuna",
  tableName: "vacunas",
  timestamps: false,
  freezeTableName: true
});

export { Vacuna };