import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Provincia extends Model { }

Provincia.init({
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
  modelName: "Provincia",
  tableName: "provincias",
  timestamps: false,
  freezeTableName: true
});

export { Provincia };