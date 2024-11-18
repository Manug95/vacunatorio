import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class TipoVacuna extends Model { }

TipoVacuna.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
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
  modelName: "TipoVacuna",
  tableName: "tipos_vacunas",
  timestamps: false,
  freezeTableName: true
});

export { TipoVacuna };