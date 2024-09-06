import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Personal extends Model { }

Personal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombres: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  apellidos: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  cargo: {
    type: DataTypes.ENUM,
    values: ['ADMINISTRATIVO', 'LOGISTICA', 'ENFERMERO'],
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['ADMINISTRATIVO', 'LOGISTICA', 'ENFERMERO']]
    }
  }
}, {
  sequelize,
  modelName: "Personal",
  tableName: "personal",
  timestamps: false,
  freezeTableName: true
});

export { Personal };