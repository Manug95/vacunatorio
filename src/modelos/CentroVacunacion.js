import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class CentroVacunacion extends Model { }

CentroVacunacion.init({
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
  modelName: "CentroVacunacion",
  tableName: "Centro-vacunacion",
  timestamps: false,
  freezeTableName: true
});

export { CentroVacunacion };