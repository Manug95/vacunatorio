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
      notEmpty: {
        msg: "El nombre del centro de vacunación es requerido"
      },
      len: {
        args: [1, 50],
        msg: "El nombre de tener entre 1 y 50 caracteres de largo"
      },
      notNull: {
        msg: "El nombre del centro de vacunación es requerido"
      }
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