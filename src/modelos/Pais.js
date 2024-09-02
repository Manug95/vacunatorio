import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Pais extends Model { }

Pais.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
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
  modelName: "Pais",
  tableName: "paises",
  timestamps: false,
  freezeTableName: true
});

export { Pais };