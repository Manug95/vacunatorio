import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Enfermero extends Model { }

Enfermero.init({
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
  licencia: {
    type: DataTypes.ENUM,
    values: ['A', 'B', 'C'],
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['A', 'B', 'C']]
    }
  }
}, {
  sequelize,
  modelName: "Enfermero",
  tableName: "enfermero",
  timestamps: false,
  freezeTableName: true
});

export { Enfermero };